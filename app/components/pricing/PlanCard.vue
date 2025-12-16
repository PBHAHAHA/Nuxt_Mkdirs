<script setup lang="ts">
import { Check, X } from 'lucide-vue-next';
import { cn } from '~/utils';

interface PricePlan {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  price: number;
  priceSuffix: string;
  isPopular?: boolean;
}

interface Props {
  plan: PricePlan;
}

const props = defineProps<Props>();

function getPlanIdFromTitle(title: string): 'free' | 'pro' | 'sponsor' {
  const normalized = title.trim().toLowerCase();
  if (normalized === 'pro') return 'pro';
  if (normalized === 'sponsor') return 'sponsor';
  return 'free';
}

function handleAction() {
  const plan = getPlanIdFromTitle(props.plan.title);
  navigateTo({ path: '/submit', query: { plan } });
}
</script>

<template>
  <div class="relative pt-4">
    <!-- Popular badge -->
    <div v-if="plan.isPopular" class="absolute top-0.5 left-1/2 transform -translate-x-1/2 z-10">
      <div class="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
        POPULAR
      </div>
    </div>

    <div
      :class="cn(
        'relative overflow-hidden flex flex-col rounded-xl shadow-sm',
        plan.isPopular ? 'border-2 border-primary' : 'border'
      )"
    >
      <!-- Price plan title and price -->
      <div class="bg-muted/50 p-6 pr-10 border-b flex flex-row items-center justify-between">
        <span class="text-2xl font-bold uppercase tracking-wider">
          {{ plan.title }}
        </span>
        <div class="flex items-baseline gap-2">
          <div class="text-4xl font-semibold leading-relaxed text-primary">
            ${{ plan.price }}
          </div>
          <div v-if="plan.priceSuffix" class="text-sm font-semibold leading-relaxed text-muted-foreground">
            {{ plan.priceSuffix }}
          </div>
        </div>
      </div>

      <!-- Price plan features and limitations -->
      <div class="flex flex-col flex-grow px-6 py-8">
        <div class="grow space-y-4">
          <div class="grid grid-cols-1 gap-4 text-left text-sm leading-normal">
            <!-- Benefits -->
            <div v-for="feature in plan.benefits" :key="feature" class="flex items-start gap-x-4">
              <Check class="text-primary size-4 shrink-0 mt-0.5" />
              <p>{{ feature }}</p>
            </div>

            <!-- Limitations -->
            <div v-for="feature in plan.limitations" :key="feature" class="flex items-start gap-x-4">
              <X class="size-4 shrink-0 mt-0.5" />
              <p class="text-muted-foreground">{{ feature }}</p>
            </div>
          </div>
        </div>

        <!-- Action button -->
        <div class="mt-12 px-6">
          <UiButton
            :variant="plan.isPopular ? 'default' : 'outline'"
            class="w-full"
            @click="handleAction"
          >
            {{ plan.price === 0 ? 'Get Started' : 'Subscribe' }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
