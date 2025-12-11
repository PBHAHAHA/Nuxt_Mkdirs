<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Hash, Sparkles } from 'lucide-vue-next';
import type { ItemInfo } from '~/types';
import { cn } from '~/utils';
import { getSanityImageUrl } from '~/utils/sanity-image';

interface Props {
  item: ItemInfo;
  compact?: boolean; // compact mode: only show image, hover to show details
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
});

// Get image URL from Sanity image or string
const imageUrl = computed(() => {
  const img = props.item.image as any;
  if (img?.asset) {
    return getSanityImageUrl(img, { width: 800, height: 450 });
  }
  return typeof img === 'string' ? img : '';
});
</script>

<template>
  <!-- Compact mode: image only with hover overlay -->
  <a
    v-if="compact"
    :href="item.link"
    target="_blank"
    rel="noopener noreferrer"
    class="group relative block w-full overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <div class="relative aspect-video w-full">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="`Preview of ${item.name}`"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        <span class="text-5xl font-bold text-muted-foreground/30">{{ item.name?.charAt(0)?.toUpperCase() || '?' }}</span>
      </div>

      <!-- Sponsor badge (always visible) -->
      <div class="absolute top-2 left-2">
        <span class="inline-flex items-center gap-1 text-xs font-medium text-white bg-primary/90 backdrop-blur-sm rounded-full px-2 py-1">
          <Sparkles class="size-3" />
          Sponsored
        </span>
      </div>

      <!-- Hover overlay with details -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 class="font-semibold text-lg text-white truncate mb-1">
          {{ item.name }}
        </h3>
        <p class="text-sm text-white/80 line-clamp-2 mb-3">
          {{ item.description }}
        </p>
        <div class="flex items-center gap-2 text-white text-sm font-medium">
          <span>Visit Website</span>
          <ArrowUpRight class="size-4" />
        </div>
      </div>
    </div>
  </a>

  <!-- Full mode: same style as ItemCard2 with background image -->
  <div
    v-else
    :class="cn(
      'relative border rounded-lg flex flex-col justify-between overflow-hidden min-h-[280px]',
      'duration-300 shadow-sm hover:shadow-lg transition-all group'
    )"
  >
    <!-- Background Image -->
    <div
      v-if="imageUrl"
      class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
      :style="{ backgroundImage: `url(${imageUrl})` }"
    />
    <!-- Gradient Overlay for readability -->
    <div
      :class="cn(
        'absolute inset-0 transition-opacity duration-300',
        imageUrl
          ? 'bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60'
          : 'bg-card'
      )"
    />

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-between h-full p-6">
      <!-- Top section -->
      <div class="flex flex-col gap-3">
        <!-- Sponsored badge -->
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1 text-xs font-medium text-white bg-primary/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Sparkles class="size-3" />
            Sponsored
          </span>
          <a
            v-if="item.link"
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white transition-colors"
          >
            <span>Visit</span>
            <ArrowUpRight class="size-3" />
          </a>
        </div>

        <!-- Name -->
        <NuxtLink :to="`/item/${item.slug}`" class="min-w-0">
          <h3
            :class="cn(
              'text-xl font-semibold truncate overflow-hidden text-ellipsis',
              imageUrl ? 'text-white drop-shadow-md' : 'text-gradient_indigo-purple'
            )"
          >
            {{ item.name }}
          </h3>
        </NuxtLink>

        <!-- Categories (if available) -->
        <div v-if="item.categories && item.categories.length > 0" class="flex flex-wrap gap-2 items-center">
          <NuxtLink
            v-for="category in item.categories"
            :key="category._id"
            :to="`/category/${category.slug}`"
            :class="cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium px-2 py-1 h-6',
              imageUrl
                ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                : 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
            )"
          >
            <span class="text-sm">{{ category.name }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom section: Description + Tags -->
      <div class="mt-auto pt-4">
        <!-- Description -->
        <NuxtLink :to="`/item/${item.slug}`" class="block cursor-pointer">
          <p
            :class="cn(
              'text-sm line-clamp-2 leading-relaxed',
              imageUrl ? 'text-white/90' : 'text-muted-foreground'
            )"
          >
            {{ item.description }}
          </p>
        </NuxtLink>

        <!-- Tags -->
        <div v-if="item.tags && item.tags.length > 0" class="mt-3 flex flex-wrap gap-2 items-center">
          <NuxtLink
            v-for="(tag, index) in item.tags.slice(0, 3)"
            :key="index"
            :to="`/tag/${typeof tag === 'string' ? tag.toLowerCase().replace(/[\s/]+/g, '-') : tag}`"
            class="flex items-center justify-center space-x-0.5 group/tag"
          >
            <Hash :class="cn('w-3 h-3 icon-scale', imageUrl ? 'text-white/70' : 'text-muted-foreground')" />
            <span :class="cn('text-sm link-underline', imageUrl ? 'text-white/70' : 'text-muted-foreground')">
              {{ typeof tag === 'string' ? tag : tag }}
            </span>
          </NuxtLink>
          <span v-if="item.tags.length > 3" :class="cn('text-sm px-1', imageUrl ? 'text-white/60' : 'text-muted-foreground')">
            +{{ item.tags.length - 3 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
