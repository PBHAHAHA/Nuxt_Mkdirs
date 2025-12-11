# SEO Configuration Guide

This guide explains how to configure SEO for your Nuxt Mkdirs directory website.

## Quick Start

All SEO settings are centralized in one file for easy customization:

```
app/config/site.ts
```

## Configuration Overview

### 1. Basic Site Info

Update these in `app/config/site.ts`:

```typescript
export const siteConfig: SiteConfig = {
  // Site name - appears in browser tab and SEO
  name: "Your Site Name",
  
  // Short tagline
  tagline: "Your site tagline",
  
  // Full description for SEO
  description: "Your site description for search engines...",
  
  // SEO keywords
  keywords: ["keyword1", "keyword2", "keyword3"],
  
  // Author name
  author: "Your Name",
  
  // Site URL (important for canonical URLs)
  url: "https://your-domain.com",
  
  // ...
};
```

### 2. SEO Settings

```typescript
seo: {
  // Title template - %s is replaced with page title
  // Example: "About | Your Site Name"
  titleTemplate: "%s | Your Site Name",
  
  // Open Graph settings
  ogType: "website",
  ogLocale: "en_US", // Change for other languages
  
  // Twitter Card settings
  twitterCard: "summary_large_image",
  twitterSite: "@your_twitter",
  twitterCreator: "@your_twitter",
  
  // Search Console verification (optional)
  googleSiteVerification: "your-code",
  bingSiteVerification: "your-code",
  
  // Robots settings
  robots: {
    index: true,  // Allow indexing
    follow: true, // Allow following links
  },
  
  // Language
  language: "en",
}
```

### 3. Open Graph Image

Place your Open Graph image at:
```
public/og.png
```

Recommended size: **1200x630 pixels**

## Using SEO in Pages

### Basic Usage

```vue
<script setup>
// Simple - just set title
useSeo({ title: 'About Us' });

// Full options
useSeo({
  title: 'Page Title',
  description: 'Page description',
  image: '/images/page-image.jpg',
  keywords: ['page', 'keywords'],
});
</script>
```

### For Item/Product Pages

```vue
<script setup>
const item = await fetchItem();

useItemSeo({
  name: item.name,
  description: item.description,
  image: item.image,
  slug: item.slug,
  tags: item.tags,
  category: item.category,
});
</script>
```

### For Blog Posts

```vue
<script setup>
const post = await fetchPost();

useBlogSeo({
  title: post.title,
  excerpt: post.excerpt,
  image: post.image,
  slug: post.slug,
  publishedAt: post.publishedAt,
  author: post.author,
});
</script>
```

### For Category/Tag Pages

```vue
<script setup>
useCategorySeo({
  name: category.name,
  description: category.description,
  slug: category.slug,
});

// or for tags
useTagSeo({
  name: tag.name,
  slug: tag.slug,
});
</script>
```

## Structured Data (JSON-LD)

Structured data helps search engines understand your content and can enable rich results.

### Homepage

```vue
<script setup>
// Add organization and website schema
useOrganizationSchema();
useWebsiteSchema();
</script>
```

### Item Pages

```vue
<script setup>
useItemSchema({
  name: item.name,
  description: item.description,
  image: item.image,
  url: `/item/${item.slug}`,
  category: item.category,
});

// Add breadcrumbs
useBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: item.category, url: `/category/${item.categorySlug}` },
  { name: item.name, url: `/item/${item.slug}` },
]);
</script>
```

### Blog Posts

```vue
<script setup>
useArticleSchema({
  title: post.title,
  description: post.excerpt,
  image: post.image,
  url: `/blog/${post.slug}`,
  publishedAt: post.publishedAt,
  author: post.author,
});
</script>
```

### FAQ Pages

```vue
<script setup>
import { faqConfig } from '~/config/faq';

useFaqSchema(faqConfig.items.map(item => ({
  question: item.question,
  answer: item.answer,
})));
</script>
```

## Sitemap

Sitemap is automatically generated at `/sitemap.xml`.

### Configuration

In `nuxt.config.ts`:

```typescript
sitemap: {
  // Exclude routes from sitemap
  exclude: [
    '/dashboard/**',
    '/studio/**',
    '/auth/**',
  ],
},
```

## Robots.txt

Edit `public/robots.txt` to control crawler access:

```txt
User-Agent: *
Allow: /

Disallow: /dashboard/
Disallow: /studio/
Disallow: /auth/
Disallow: /api/

Sitemap: https://your-domain.com/sitemap.xml
```

**Important:** Update the Sitemap URL to your production domain!

## Environment Variables

For production, set these in your `.env`:

```env
# Your production URL
NUXT_PUBLIC_APP_URL=https://your-domain.com

# Google Analytics (optional)
NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Checklist Before Launch

- [ ] Update `site.ts` with your site info
- [ ] Replace `public/og.png` with your OG image (1200x630)
- [ ] Replace `public/logo.png` with your logo
- [ ] Update `robots.txt` Sitemap URL
- [ ] Set `NUXT_PUBLIC_APP_URL` in production
- [ ] Add Google/Bing verification codes (optional)
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Multi-language SEO

For multi-language sites, update the `ogLocale` and `language` settings:

```typescript
seo: {
  ogLocale: "zh_CN", // Chinese
  language: "zh",
}
```

Common locales:
- `en_US` - English (US)
- `en_GB` - English (UK)
- `zh_CN` - Chinese (Simplified)
- `zh_TW` - Chinese (Traditional)
- `ja_JP` - Japanese
- `ko_KR` - Korean
- `de_DE` - German
- `fr_FR` - French
- `es_ES` - Spanish
