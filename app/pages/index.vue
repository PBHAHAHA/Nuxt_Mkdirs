<script setup lang="ts">
import { Sparkles, Star, FileText, ArrowRight } from 'lucide-vue-next';
import { getSanityImageUrl } from '~/utils/sanity-image';

// Fetch latest items from Sanity
const { data: latestItemsData } = await useFetch('/api/items/latest', {
  query: { count: 8 },
});

const latestItems = computed(() => {
  if (!latestItemsData.value) return [];
  return latestItemsData.value.map((item: any) => ({
    _id: item._id,
    name: item.name,
    slug: item.slug?.current || item.slug,
    link: item.link,
    description: item.description,
    icon: item.icon,
    image: item.image,
    featured: item.featured,
    tags: item.tags?.map((t: any) => t.name) || [],
    category: item.categories?.[0]?.name || '',
  }));
});

// Fetch featured items from Sanity
const { data: featuredItemsData } = await useFetch('/api/items/featured', {
  query: { count: 8 },
});

const featuredItems = computed(() => {
  if (!featuredItemsData.value) return [];
  return featuredItemsData.value.map((item: any) => ({
    _id: item._id,
    name: item.name,
    slug: item.slug?.current || item.slug,
    link: item.link,
    description: item.description,
    icon: item.icon,
    image: item.image,
    featured: item.featured,
    tags: item.tags?.map((t: any) => t.name) || [],
    category: item.categories?.[0]?.name || '',
  }));
});

// Fetch sponsor item from Sanity
const { data: sponsorItemData } = await useFetch('/api/items/sponsor');

const sponsorItem = computed(() => {
  if (!sponsorItemData.value) return null;
  const item = sponsorItemData.value;
  return {
    _id: item._id,
    name: item.name,
    slug: item.slug?.current || item.slug,
    link: item.link,
    description: item.description,
    icon: item.icon,
    image: item.image,
    featured: item.featured,
    tags: item.tags?.map((t: any) => t.name) || [],
    category: item.categories?.[0]?.name || '',
  };
});

// Fetch latest blog posts from Sanity
const { data: blogPostsData } = await useFetch('/api/blog/latest', {
  query: { count: 8 },
});

const blogPosts = computed(() => {
  if (!blogPostsData.value) return [];
  return blogPostsData.value.map((post: any) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug?.current || post.slug,
    excerpt: post.excerpt,
    image: post.image ? getSanityImageUrl(post.image, { width: 800, height: 600 }) : '',
    publishedAt: post.publishDate,
    author: post.author?.name || '',
    categories: post.categories?.map((c: any) => c.name) || [],
  }));
});

// SEO - using centralized config from site.ts
useSeo({
  title: 'Home',
  description: 'Discover the best tools and resources in our directory. Browse latest products, featured items, and blog posts.',
});

// Structured data for homepage
useWebsiteSchema();
useOrganizationSchema();
</script>

<template>
  <LayoutContainer class="mt-12 mb-16 flex flex-col gap-12">
    <!-- Hero -->
    <HomeHero url-prefix="/search" />

    <!-- Content Sections -->
    <div class="flex flex-col gap-12">
      <!-- Latest Products -->
      <section v-if="latestItems.length > 0" class="flex flex-col gap-8">
        <div class="flex items-center justify-between gap-8">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-primary" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              Latest Products
            </h2>
          </div>
          <NuxtLink to="/search" class="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            More <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- First 2 items -->
          <ItemCard
            v-for="item in latestItems.slice(0, 2)"
            :key="item._id"
            :item="item"
          />
          
          <!-- Sponsor item inserted after first 2 -->
          <ItemSponsorItemCard
            v-if="sponsorItem"
            :item="sponsorItem"
          />
          
          <!-- Remaining items -->
          <ItemCard
            v-for="item in latestItems.slice(2)"
            :key="item._id"
            :item="item"
          />
        </div>
      </section>

      <!-- Featured Products -->
      <section v-if="featuredItems.length > 0" class="flex flex-col gap-8">
        <div class="flex items-center justify-between gap-8">
          <div class="flex items-center gap-2">
            <Star class="w-4 h-4 text-primary" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              Featured Products
            </h2>
          </div>
          <NuxtLink to="/search?f=featured" class="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            More <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ItemCard
            v-for="item in featuredItems"
            :key="item._id"
            :item="item"
          />
        </div>
      </section>

      <!-- Latest Blog Posts -->
      <section v-if="blogPosts.length > 0" class="flex flex-col gap-8">
        <div class="flex items-center justify-between gap-8">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-primary" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              Latest Posts
            </h2>
          </div>
          <NuxtLink to="/blog" class="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            More <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <BlogGrid :posts="blogPosts" />
      </section>
    </div>

    <!-- Newsletter -->
    <HomeNewsletter />
  </LayoutContainer>
</template>