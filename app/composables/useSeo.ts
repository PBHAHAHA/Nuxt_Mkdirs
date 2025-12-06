import { siteConfig } from '~/config/site';
import type { PageSeoOptions } from '~/types';

/**
 * ============================================
 * SEO COMPOSABLE
 * ============================================
 * 
 * This composable provides a unified way to set SEO meta tags across all pages.
 * It automatically applies site-wide defaults and allows page-specific overrides.
 * 
 * Usage:
 * ```ts
 * // Basic usage - just title
 * useSeo({ title: 'About Us' });
 * 
 * // Full usage with all options
 * useSeo({
 *   title: 'Product Name',
 *   description: 'Product description',
 *   image: '/images/product.jpg',
 *   keywords: ['product', 'category'],
 * });
 * ```
 */

export function useSeo(options: PageSeoOptions = {}) {
  const { seo } = siteConfig;
  const route = useRoute();
  
  // Build the full title using template
  const fullTitle = options.title 
    ? seo.titleTemplate.replace('%s', options.title)
    : `${siteConfig.name} - ${siteConfig.tagline}`;
  
  // Build description
  const description = options.description || siteConfig.description;
  
  // Build keywords
  const keywords = options.keywords?.length 
    ? [...options.keywords, ...siteConfig.keywords].join(', ')
    : siteConfig.keywords.join(', ');
  
  // Build image URL (ensure absolute URL)
  const imageUrl = options.image 
    ? (options.image.startsWith('http') ? options.image : `${siteConfig.url}${options.image}`)
    : siteConfig.image;
  
  // Build canonical URL
  const canonicalUrl = options.canonical || `${seo.canonicalUrl || siteConfig.url}${route.path}`;
  
  // Build robots directive
  const robotsContent = [
    options.noIndex ? 'noindex' : (seo.robots.index ? 'index' : 'noindex'),
    options.noFollow ? 'nofollow' : (seo.robots.follow ? 'follow' : 'nofollow'),
  ].join(', ');
  
  // Set all meta tags
  useSeoMeta({
    // Basic SEO
    title: fullTitle,
    description,
    keywords,
    author: options.author || siteConfig.author,
    robots: robotsContent,
    
    // Open Graph
    ogTitle: options.title || siteConfig.name,
    ogDescription: description,
    ogImage: imageUrl,
    ogUrl: canonicalUrl,
    ogType: (options.ogType || seo.ogType) as 'website' | 'article',
    ogSiteName: siteConfig.name,
    ogLocale: seo.ogLocale,
    
    // Twitter Card
    twitterCard: seo.twitterCard,
    twitterTitle: options.title || siteConfig.name,
    twitterDescription: description,
    twitterImage: imageUrl,
    twitterSite: seo.twitterSite,
    twitterCreator: seo.twitterCreator,
    
    // Article specific (for blog posts)
    ...(options.publishedTime && { articlePublishedTime: options.publishedTime }),
    ...(options.modifiedTime && { articleModifiedTime: options.modifiedTime }),
  });
  
  // Set head elements
  useHead({
    htmlAttrs: {
      lang: seo.language,
    },
    link: [
      { rel: 'canonical', href: canonicalUrl },
    ],
    meta: [
      // Verification codes
      ...(seo.googleSiteVerification ? [{ name: 'google-site-verification', content: seo.googleSiteVerification }] : []),
      ...(seo.bingSiteVerification ? [{ name: 'msvalidate.01', content: seo.bingSiteVerification }] : []),
    ],
  });
  
  return {
    title: fullTitle,
    description,
    canonicalUrl,
    imageUrl,
  };
}

/**
 * Set SEO for item/product pages
 */
export function useItemSeo(item: {
  name: string;
  description?: string;
  image?: string;
  slug: string;
  tags?: string[];
  category?: string;
}) {
  return useSeo({
    title: item.name,
    description: item.description || `${item.name} - ${siteConfig.tagline}`,
    image: item.image,
    keywords: [
      item.name,
      ...(item.tags || []),
      ...(item.category ? [item.category] : []),
    ],
    ogType: 'website',
  });
}

/**
 * Set SEO for blog post pages
 */
export function useBlogSeo(post: {
  title: string;
  excerpt?: string;
  image?: string;
  slug: string;
  publishedAt?: string;
  author?: string;
  categories?: string[];
}) {
  return useSeo({
    title: post.title,
    description: post.excerpt || `${post.title} - ${siteConfig.name} Blog`,
    image: post.image,
    keywords: post.categories,
    ogType: 'article',
    publishedTime: post.publishedAt,
    author: post.author,
  });
}

/**
 * Set SEO for category pages
 */
export function useCategorySeo(category: {
  name: string;
  description?: string;
  slug: string;
}) {
  return useSeo({
    title: `${category.name} - Directory`,
    description: category.description || `Browse ${category.name} in our directory. Find the best ${category.name.toLowerCase()} tools and resources.`,
    keywords: [category.name, 'directory', 'tools', 'resources'],
  });
}

/**
 * Set SEO for tag pages
 */
export function useTagSeo(tag: {
  name: string;
  slug: string;
}) {
  return useSeo({
    title: `${tag.name} - Tags`,
    description: `Explore items tagged with ${tag.name}. Discover tools and resources related to ${tag.name.toLowerCase()}.`,
    keywords: [tag.name, 'tags', 'directory'],
  });
}

/**
 * Set SEO for collection pages
 */
export function useCollectionSeo(collection: {
  name: string;
  description?: string;
  slug: string;
}) {
  return useSeo({
    title: `${collection.name} - Collection`,
    description: collection.description || `${collection.name} collection - Curated list of the best tools and resources.`,
    keywords: [collection.name, 'collection', 'curated'],
  });
}
