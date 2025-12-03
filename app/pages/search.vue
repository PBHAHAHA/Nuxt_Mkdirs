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
  title: 'Search - Directory Template',
  description: 'Search for your needs.',
});
</script>

<template>
  <div class="mb-16">
    <!-- Header -->
    <div class="mt-8">
      <div class="w-full flex flex-col items-center justify-center gap-8">
        <SharedHeaderSection
          label="Search"
          title="Search anything you want"
        />

        <!-- Search Filter -->
        <div class="w-full">
          <!-- Desktop -->
          <LayoutContainer class="hidden md:flex md:flex-col">
            <HomeSearchFilter :tags="tags" :categories="categories" url-prefix="/search" />
          </LayoutContainer>
          
          <!-- Mobile -->
          <div class="md:hidden flex flex-col mx-4">
            <HomeSearchFilter :tags="tags" :categories="categories" url-prefix="/search" />
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <LayoutContainer class="mt-8">
      <!-- Empty state -->
      <SharedEmptyState v-if="items.length === 0" />

      <!-- Items grid -->
      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ItemCard
            v-for="item in items"
            :key="item._id"
            :item="item"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex items-center justify-center">
          <SharedPagination route-prefix="/search" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>
  </div>
</template>
