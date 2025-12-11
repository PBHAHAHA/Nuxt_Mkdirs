<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { siteConfig } from '~/config/site';
</script>

<template>
  <div>
    <div class="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <!-- Auth form -->
      <div class="flex items-center justify-center relative w-full h-full min-h-screen">
        <!-- Back button -->
        <NuxtLink
          to="/"
          class="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Back
        </NuxtLink>

        <div class="w-full max-w-md px-4">
          <slot />
        </div>
      </div>

      <!-- Brand image -->
      <div class="hidden bg-muted lg:block">
        <div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <div class="text-center space-y-4 p-8">
            <img 
              src="/logo.png" 
              alt="Logo" 
              class="w-20 h-20 mx-auto rounded-2xl"
            />
            <h2 class="text-2xl font-bold">{{ siteConfig.name }}</h2>
            <p class="text-muted-foreground max-w-sm">
              {{ siteConfig.tagline }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
