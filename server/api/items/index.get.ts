/**
 * Get items list from Sanity
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const category = query.category as string | undefined;
  const tag = query.tag as string | undefined;
  const sort = query.sort as string | undefined;
  const filter = query.f as string | undefined;
  const searchQuery = query.q as string | undefined;
  const dateFrom = query.dateFrom as string | undefined;
  const dateTo = query.dateTo as string | undefined;

  try {
    // Build query based on filters
    // Only show published items (must have publishDate)
    let groqQuery = `*[_type == "item" && defined(slug.current) 
      && defined(publishDate)
      && forceHidden != true
      && sponsor != true`;

    // Build params object - only include defined values
    const params: Record<string, any> = {};

    // Search query (name, description, introduction)
    if (searchQuery) {
      const pattern = `*${searchQuery}*`;
      groqQuery += ` && (name match "${pattern}" || description match "${pattern}" || introduction match "${pattern}")`;
    }

    // Category filter
    if (category) {
      groqQuery += ` && $category in categories[]->slug.current`;
      params.category = category;
    }

    // Tag filter (supports multiple tags separated by comma)
    if (tag) {
      const tagList = tag.split(',');
      if (tagList.length === 1) {
        groqQuery += ` && $tag in tags[]->slug.current`;
        params.tag = tag;
      } else {
        // Multiple tags - item must have ALL selected tags
        groqQuery += ` && count((tags[]->slug.current)[@ in [${tagList.map(t => `"${t}"`).join(', ')}]]) == ${tagList.length}`;
      }
    }

    // Filter (featured, free, paid)
    if (filter === 'featured') {
      groqQuery += ` && featured == true`;
    } else if (filter === 'free') {
      groqQuery += ` && (pricePlan == "free" || !defined(pricePlan))`;
    } else if (filter === 'paid') {
      groqQuery += ` && pricePlan == "paid"`;
    }

    // Date range filter (based on publishDate)
    if (dateFrom && dateTo) {
      groqQuery += ` && publishDate >= $dateFrom && publishDate <= $dateTo`;
      params.dateFrom = dateFrom;
      params.dateTo = dateTo;
    } else if (dateFrom) {
      groqQuery += ` && publishDate >= $dateFrom`;
      params.dateFrom = dateFrom;
    } else if (dateTo) {
      groqQuery += ` && publishDate <= $dateTo`;
      params.dateTo = dateTo;
    }

    groqQuery += `]`;

    // Sort order
    let sortOrder = 'order(coalesce(featured, false) desc, _createdAt desc)';
    if (sort === 'time-asc') {
      sortOrder = 'order(_createdAt asc)';
    } else if (sort === 'name-asc') {
      sortOrder = 'order(name asc)';
    } else if (sort === 'name-desc') {
      sortOrder = 'order(name desc)';
    }
    groqQuery += ` | ${sortOrder}`;

    // Get total count (remove sort order for count query)
    const baseQuery = groqQuery.split(' | ')[0]; // Remove sort order
    const countQuery = baseQuery.replace('*[', 'count(*[') + ')';
    const total = await sanityFetch<number>(countQuery, params);

    // Get paginated items
    const start = (page - 1) * limit;
    const end = start + limit;
    const itemsQuery = `${groqQuery} [${start}...${end}] {
      _id,
      _createdAt,
      name,
      slug,
      description,
      link,
      featured,
      icon {
        ...,
        "blurDataURL": asset->metadata.lqip,
      },
      image {
        ...,
        "blurDataURL": asset->metadata.lqip,
      },
      publishDate,
      categories[]->,
      tags[]->,
    }`;

    const items = await sanityFetch<any[]>(itemsQuery, params);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching items:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch items',
    });
  }
});
