// Site Configuration Types
export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  keywords: string[];
  author: string;
  url: string;
  logo: string;
  logoDark?: string;
  image: string;
  mail: string;
  utm: {
    source: string;
    medium: string;
    campaign: string;
  };
  links: {
    github?: string;
    twitter?: string;
    youtube?: string;
  };
  // SEO Configuration
  seo: SeoConfig;
};

// SEO Configuration Types
export type SeoConfig = {
  // Basic SEO
  titleTemplate: string; // e.g., "%s | Site Name"
  titleSeparator: string; // e.g., " | "
  
  // Open Graph
  ogType: string; // e.g., "website"
  ogLocale: string; // e.g., "en_US"
  
  // Twitter Card
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string; // e.g., "@username"
  twitterCreator?: string; // e.g., "@username"
  
  // Verification codes (for search console)
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  
  // Robots
  robots: {
    index: boolean;
    follow: boolean;
  };
  
  // Language
  language: string; // e.g., "en"
  
  // Canonical URL prefix (usually same as site url)
  canonicalUrl?: string;
};

// Page-specific SEO options
export type PageSeoOptions = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  ogType?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
};

export type HeroConfig = {
  title: {
    first: string;
    second: string;
  };
  subtitle: string;
  label: {
    text: string;
    icon: string;
    href: string;
  };
};

export type MarketingConfig = {
  menus: NavItem[];
};

export type DashboardConfig = {
  menus: NavItem[];
};

export type UserButtonConfig = {
  menus: NavItem[];
};

export type FooterConfig = {
  links: NestedNavItem[];
};

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
};

export type NestedNavItem = {
  title: string;
  items: NavItem[];
  icon?: string;
};

export type PriceConfig = {
  plans: PricePlan[];
};

export type PricePlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  price: number;
  priceSuffix: string;
  stripePriceId: string | null;
};

export type FAQConfig = {
  items: FAQItem[];
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

// Item types (simplified for demo)
export type ItemInfo = {
  _id: string;
  _createdAt?: string;
  name: string;
  slug: string;
  link: string;
  description: string;
  image?: string;
  icon?: string;
  tags?: string[];
  category?: string;
  categories?: CategoryInfo[];
  featured?: boolean;
  pricePlan?: string;
  affiliateLink?: string;
  publishDate?: string;
  freePlanStatus?: string;
  proPlanStatus?: string;
  sponsorPlanStatus?: string;
  sponsorStartDate?: string;
  sponsorEndDate?: string;
  rejectionReason?: string;
};

export type CategoryInfo = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  itemCount?: number;
};

export type TagInfo = {
  _id: string;
  name: string;
  slug: string;
  itemCount?: number;
};

export type BlogPostInfo = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  publishedAt?: string;
  author?: string;
  categories?: string[];
};

export type CollectionInfo = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  items?: ItemInfo[];
};
