<script setup lang="ts">
import { ArrowUpRight, Sparkles } from 'lucide-vue-next';
import type { ItemInfo } from '~/types';
import { cn } from '~/utils';
import { getSanityImageUrl } from '~/utils/sanity-image';

interface Props {
  item: ItemInfo;
}

const props = defineProps<Props>();

// Get icon URL from Sanity image or string
const iconUrl = computed(() => {
  const icon = props.item.icon as any;
  if (icon?.asset) {
    return getSanityImageUrl(icon, { width: 64, height: 64 });
  }
  return typeof icon === 'string' ? icon : '';
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
  <a
    :href="item.link"
    target="_blank"
    rel="noopener noreferrer"
    class="group relative block w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <!-- Main Image -->
    <div class="relative aspect-video w-full">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="`Preview of ${item.name}`"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
        <span class="text-5xl font-bold text-purple-300 dark:text-purple-600">{{ item.name?.charAt(0)?.toUpperCase() || '?' }}</span>
      </div>

      <!-- Sponsor badge (always visible) -->
      <div class="absolute top-3 left-3">
        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <Sparkles class="size-3" />
          Sponsored
        </span>
      </div>

      <!-- Hover overlay with details -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <!-- Icon + Title -->
        <div class="flex items-center gap-3 mb-3">
          <img
            v-if="iconUrl"
            :src="iconUrl"
            :alt="`icon of ${item.name}`"
            class="w-10 h-10 object-cover rounded-xl ring-2 ring-white/30 bg-white"
          />
          <div
            v-else
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm"
          >
            {{ item.name.charAt(0).toUpperCase() }}
          </div>
          <h3 class="font-semibold text-lg text-white truncate flex-1">
            {{ item.name }}
          </h3>
        </div>

        <!-- Description -->
        <p class="text-sm text-white/80 line-clamp-2 mb-4">
          {{ item.description }}
        </p>

        <!-- CTA Button -->
        <button
          :class="cn(
            'w-full rounded-xl h-10 px-6',
            'bg-white hover:bg-gray-100',
            'text-gray-900 font-medium',
            'transition-colors duration-200'
          )"
        >
          <div class="flex items-center justify-center gap-2">
            <span>Visit Website</span>
            <ArrowUpRight class="size-4" />
          </div>
        </button>
      </div>
    </div>
  </a>
</template>
