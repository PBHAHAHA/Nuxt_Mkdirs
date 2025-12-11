/**
 * Get single item by slug from Sanity
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    });
  }

  try {
    const query = `*[_type == "item" && slug.current == $slug && forceHidden != true][0] {
      _id,
      _createdAt,
      name,
      slug,
      description,
      introduction,
      link,
      affiliateLink,
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
      "related": *[_type == "item" && defined(slug.current) 
        && defined(publishDate) 
        && forceHidden != true
        && sponsor != true
        && count(categories[@._ref in ^.^.categories[]._ref]) > 0 && _id != ^._id] 
        | order(publishedDate desc, _createdAt desc) [0...3] {
          _id,
          name,
          slug,
          description,
          icon {
            ...,
            "blurDataURL": asset->metadata.lqip,
          },
          image {
            ...,
            "blurDataURL": asset->metadata.lqip,
          },
          categories[]->,
          tags[]->,
      },
    }`;

    const item = await sanityFetch<any>(query, { slug });

    if (!item) {
      throw createError({
        statusCode: 404,
        message: 'Item not found',
      });
    }

    return item;
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw error;
    }
    console.error('Error fetching item:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch item',
    });
  }
});
