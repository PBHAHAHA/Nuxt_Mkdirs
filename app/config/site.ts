import type { SiteConfig } from '~/types';

/**
 * ============================================
 * SITE CONFIGURATION
 * ============================================
 * 
 * This is the main configuration file for your directory website.
 * Update these values to customize your site's SEO, branding, and metadata.
 * 
 * After modifying this file, restart the dev server to see changes.
 */

// Your site's base URL (update this for production)
const SITE_URL = process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const siteConfig: SiteConfig = {
  // ============================================
  // BASIC SITE INFO
  // ============================================
  
  // Site name - appears in browser tab, SEO, and navigation
  name: "Nuxt Mkdirs",
  
  // Short tagline - used in hero sections and meta descriptions
  tagline: "The Nuxt.js version of Mkdirs, the best directory website template",
  
  // Full description - used for SEO meta description
  description:
    "This is a demo site for Nuxt Mkdirs template. Built with Nuxt.js, it offers the same power as the original Mkdirs. Build trending and profitable directory websites in minutes.",
  
  // SEO keywords - helps search engines understand your content
  keywords: [
    "Directory",
    "Template",
    "Boilerplate",
    "Nuxt.js",
    "Vue.js",
    "Tailwindcss",
    "Mkdirs",
  ],
  
  // Author name - appears in meta tags
  author: "Mkdirs",
  
  // Site URL - used for canonical URLs and Open Graph
  url: SITE_URL,
  
  // ============================================
  // BRANDING
  // ============================================
  
  // Logo path (relative to /public folder)
  logo: "/logo.png",
  
  // Dark mode logo (optional) - uncomment if you have a dark version
  // logoDark: "/logo-dark.png",
  
  // Default Open Graph image (1200x630 recommended)
  image: `${SITE_URL}/og.png?v=1`,
  
  // ============================================
  // CONTACT
  // ============================================
  
  // Contact email
  mail: "pub@nuxt-saas.com",
  
  // ============================================
  // UTM TRACKING
  // ============================================
  
  utm: {
    source: "nuxt-saas.com",
    medium: "referral",
    campaign: "navigation",
  },
  
  // ============================================
  // SOCIAL LINKS
  // ============================================
  
  links: {
    twitter: "https://x.com/zhirentegong",
    // github: "https://github.com/your-repo",
    // youtube: "https://youtube.com/@your-channel",
  },
  
  // ============================================
  // SEO CONFIGURATION
  // ============================================
  
  seo: {
    // Title template - %s will be replaced with page title
    // Example: "Home | Nuxt Mkdirs"
    titleTemplate: "%s | Nuxt Mkdirs",
    titleSeparator: " | ",
    
    // Open Graph settings
    ogType: "website",
    ogLocale: "en_US",
    
    // Twitter Card settings
    twitterCard: "summary_large_image",
    twitterSite: "@zhirentegong", // Your Twitter handle
    twitterCreator: "@zhirentegong",
    
    // Search Console verification (optional)
    // Get these from Google/Bing Search Console
    // googleSiteVerification: "your-google-verification-code",
    // bingSiteVerification: "your-bing-verification-code",
    
    // Robots settings
    robots: {
      index: true, // Allow search engines to index
      follow: true, // Allow search engines to follow links
    },
    
    // Language code
    language: "en",
    
    // Canonical URL (usually same as site URL)
    canonicalUrl: SITE_URL,
  },
};
