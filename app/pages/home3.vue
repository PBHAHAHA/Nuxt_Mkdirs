<script setup lang="ts">
const route = useRoute();

// Reactive query params for items API
const itemsQuery = computed(() => ({
  limit: 12,
  q: route.query.q || undefined,
  category: route.query.category || undefined,
  tag: route.query.tag || undefined,
  sort: route.query.sort || undefined,
  f: route.query.f || undefined,
  page: route.query.page || undefined,
}));

// Fetch items from Sanity - reactive to URL changes
const { data: itemsData } = await useFetch('/api/items', {
  query: itemsQuery,
  watch: [itemsQuery],
});

const items = computed(() => {
  if (!itemsData.value?.items) return [];
  return itemsData.value.items.map((item: any) => ({
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

const totalPages = computed(() => itemsData.value?.pagination?.totalPages || 1);

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

// Fetch tags from Sanity
const { data: tagsData } = await useFetch('/api/tags');

const tags = computed(() => {
  if (!tagsData.value) return [];
  return tagsData.value.map((tag: any) => ({
    value: tag.slug?.current || tag.slug,
    label: tag.name,
  }));
});

// Fetch categories from Sanity
const { data: categoriesData } = await useFetch('/api/categories');

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    value: cat.slug?.current || cat.slug,
    label: cat.name,
  }));
});

useSeoMeta({
  title: 'Home 3 - Directory Template',
  description: 'Alternative home page layout with sponsor hero and filter.',
});
</script>

<template>
  <LayoutContainer class="mt-12 mb-16 flex flex-col gap-12">
    <!-- Hero with Sponsor -->
    <HomeHeroSponsor :sponsor-item="sponsorItem" url-prefix="/home3" />

    <!-- Filter + Item Grid -->
    <div class="flex flex-col gap-8">
      <!-- Search Filter -->
      <HomeSearchFilter :tags="tags" :categories="categories" url-prefix="/home3" />

      <!-- Item Grid -->
      <SharedEmptyState v-if="items.length === 0" />
      
      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ItemCard
            v-for="item in items"
            :key="item._id"
            :item="item"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex items-center justify-center">
          <SharedPagination route-prefix="/home3" :total-pages="totalPages" />
        </div>
      </template>
    </div>

    <!-- Newsletter -->
    <HomeNewsletter />
  </LayoutContainer>
</template>
