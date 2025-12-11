import { siteConfig } from '~/config/site';

/**
 * ============================================
 * JSON-LD STRUCTURED DATA COMPOSABLE
 * ============================================
 * 
 * This composable helps generate structured data (JSON-LD) for better SEO.
 * Structured data helps search engines understand your content and can
 * enable rich results in search (like star ratings, FAQs, etc.)
 * 
 * Learn more: https://developers.google.com/search/docs/appearance/structured-data
 */

type JsonLdType = Record<string, unknown>;

/**
 * Add JSON-LD structured data to the page
 */
export function useJsonLd(data: JsonLdType | JsonLdType[]) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(data),
      },
    ],
  });
}

/**
 * Generate Organization schema
 * Use this on your homepage or about page
 */
export function useOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    email: siteConfig.mail,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.github,
      siteConfig.links.youtube,
    ].filter(Boolean),
  };
  
  useJsonLd(schema);
  return schema;
}

/**
 * Generate WebSite schema with search action
 * Use this on your homepage
 */
export function useWebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
  
  useJsonLd(schema);
  return schema;
}

/**
 * Generate BreadcrumbList schema
 * Use this on category, tag, and item pages
 */
export function useBreadcrumbSchema(items: { name: string; url: string }[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
  
  useJsonLd(schema);
  return schema;
}

/**
 * Generate Product/SoftwareApplication schema
 * Use this on item detail pages
 */
export function useItemSchema(item: {
  name: string;
  description?: string;
  image?: string;
  url: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: item.name,
    description: item.description,
    image: item.image,
    url: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    applicationCategory: item.category || 'WebApplication',
    ...(item.rating && item.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: item.rating,
        reviewCount: item.reviewCount,
      },
    }),
  };
  
  useJsonLd(schema);
  return schema;
}

/**
 * Generate Article schema
 * Use this on blog post pages
 */
export function useArticleSchema(article: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    url: article.url.startsWith('http') ? article.url : `${siteConfig.url}${article.url}`,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author || siteConfig.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
  };
  
  useJsonLd(schema);
  return schema;
}

/**
 * Generate FAQPage schema
 * Use this on FAQ pages or pages with FAQ sections
 */
export function useFaqSchema(faqs: { question: string; answer: string }[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  
  useJsonLd(schema);
  return schema;
}

/**
 * Generate ItemList schema
 * Use this on category, tag, or search results pages
 */
export function useItemListSchema(items: { name: string; url: string; position?: number }[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position || index + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
  
  useJsonLd(schema);
  return schema;
}
