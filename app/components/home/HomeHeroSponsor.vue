<script setup lang="ts">
import { Twitter } from 'lucide-vue-next';
import { heroConfig } from '~/config/hero';
import type { ItemInfo } from '~/types';

interface Props {
  sponsorItem?: ItemInfo | null;
  urlPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  sponsorItem: null,
  urlPrefix: '/home3',
});
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full flex flex-col lg:flex-row items-center lg:items-start gap-6">
      <!-- Left: Hero content -->
      <div class="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
        <!-- Label badge -->
        <a
          :href="heroConfig.label.href"
          target="_blank"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-4"
        >
          <span class="mr-2">🎉</span>
          <span>{{ heroConfig.label.text }}</span>
          <Twitter class="size-4 ml-1" />
        </a>

        <!-- Title -->
        <h1 class="font-bold text-balance text-2xl sm:text-3xl md:text-4xl">
          {{ heroConfig.title.first }}
          <span class="text-gradient_indigo-purple font-bold">
            {{ heroConfig.title.second }}
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="max-w-3xl text-balance text-muted-foreground sm:text-xl">
          {{ heroConfig.subtitle }}
        </p>

        <!-- Search Box -->
        <div class="w-full flex items-center justify-center lg:justify-start">
          <HomeSearchBox :url-prefix="urlPrefix" />
        </div>
      </div>

      <!-- Right: Sponsor card (compact mode) -->
      <div v-if="sponsorItem" class="w-full lg:w-[400px]">
        <ItemSponsorItemCard :item="sponsorItem" compact />
      </div>
    </div>
  </div>
</template>
