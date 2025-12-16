<script setup lang="ts">
import { Check, Zap, Star } from 'lucide-vue-next';
import { getSanityImageUrl } from '~/utils/sanity-image';

const route = useRoute();
const itemId = computed(() => route.params.id as string);

// Stepper steps
const steps = [
  { title: 'Details', description: 'Enter product information' },
  { title: 'Payment', description: 'Select pricing plan' },
  { title: 'Publish', description: 'Publish your product' },
];

// Fetch item from Sanity
const { data: item, error } = await useFetch('/api/item', {
  query: { id: itemId },
});

// Pricing plans
const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Basic listing for your product',
    features: [
      'Basic listing',
      'Standard visibility',
      'Manual review (1-3 days)',
    ],
    icon: Check,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    description: 'Enhanced visibility and features',
    features: [
      'Featured badge',
      'Priority placement',
      'Fast review (24 hours)',
      'Social media promotion',
    ],
    icon: Zap,
    popular: true,
  },
  {
    id: 'sponsor',
    name: 'Sponsor',
    price: '$99',
    description: 'Maximum exposure for your product',
    features: [
      'Sponsor badge',
      'Top placement',
      'Instant review',
      'Homepage feature',
      'Newsletter mention',
      'Dedicated support',
    ],
    icon: Star,
  },
];

function normalizePlanId(planId: unknown): 'free' | 'pro' | 'sponsor' {
  if (planId === 'pro' || planId === 'sponsor' || planId === 'free') return planId;
  return 'free';
}

const selectedPlan = ref<'free' | 'pro' | 'sponsor'>(normalizePlanId(item.value?.pricePlan));
const isProcessing = ref(false);

// Free plan status
const freePlanStatus = computed(() => item.value?.freePlanStatus || 'submitting');

// Handle plan selection
async function handleSelectPlan(planId: string) {
  selectedPlan.value = planId;
  isProcessing.value = true;

  try {
    if (planId === 'free') {
      // For free plan, check current status
      if (freePlanStatus.value === 'submitting') {
        // Submit to review
        await $fetch('/api/submit-to-review', {
          method: 'POST',
          body: { id: itemId.value },
        });
        alert('Successfully submitted to review! Please wait for admin approval.');
        navigateTo('/dashboard');
      } else if (freePlanStatus.value === 'approved') {
        // Already approved, go to publish
        navigateTo(`/publish/${itemId.value}`);
      } else if (freePlanStatus.value === 'pending') {
        // Waiting for review
        alert('Your submission is pending review. Please wait for admin approval.');
        navigateTo('/dashboard');
      } else if (freePlanStatus.value === 'rejected') {
        // Rejected, need to edit
        alert('Your submission was rejected. Please edit and resubmit.');
        navigateTo(`/submit`);
      }
    } else {
      // For paid plans, create checkout session
      const response = await $fetch<{ checkoutUrl?: string }>('/api/checkout', {
        method: 'POST',
        body: {
          itemId: itemId.value,
          pricePlan: planId,
        },
      });

      if (response?.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Failed to process');
  } finally {
    isProcessing.value = false;
  }
}

// Get button text based on status
const freeButtonText = computed(() => {
  switch (freePlanStatus.value) {
    case 'submitting':
      return 'Submit to Review';
    case 'pending':
      return 'Pending Review';
    case 'approved':
      return 'Go Publish';
    case 'rejected':
      return 'Edit & Resubmit';
    default:
      return 'Submit to Review';
  }
});

// Computed image URL
const imageUrl = computed(() => {
  if (!item.value?.image) return '';
  return getSanityImageUrl(item.value.image, { width: 400, height: 225 });
});

useSeoMeta({
  title: 'Submit your product (2/3) - Directory Template',
  description: 'Submit your product – Choose pricing plan.',
});
</script>

<template>
  <LayoutContainer class="py-8">
    <div>
      <!-- Header -->
      <div class="flex flex-col gap-8 md:gap-36 lg:gap-48 md:items-center md:flex-row md:justify-between">
        <div class="flex flex-col space-y-4">
          <!-- Title -->
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-semibold">Payment</h1>
          </div>

          <div class="flex items-center space-x-2">
            <!-- Label -->
            <span class="inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold">
              2 / 3
            </span>
            <!-- Subtitle -->
            <h2 class="text-base">Choose pricing plan</h2>
          </div>
        </div>

        <!-- Stepper -->
        <div class="flex-1 md:max-w-[50%]">
          <SubmitStepper :steps="steps" :current-step="2" />
        </div>
      </div>

      <!-- Content -->
      <div class="mt-8">
        <div v-if="error" class="text-center py-12">
          <p class="text-destructive">Failed to load item</p>
        </div>

        <div v-else-if="item" class="border rounded-xl overflow-hidden">
          <!-- Item Preview -->
          <div class="p-6 border-b">
            <div class="flex items-start gap-4">
              <img
                v-if="imageUrl"
                :src="imageUrl"
                :alt="item.name"
                class="w-24 h-14 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h3 class="font-semibold">{{ item.name }}</h3>
                <p class="text-sm text-muted-foreground line-clamp-2">{{ item.description }}</p>
              </div>
            </div>
          </div>

          <!-- Pricing Plans -->
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-6">Select a plan</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="plan in plans"
                :key="plan.id"
                :class="[
                  'relative border rounded-xl p-6 cursor-pointer transition-all',
                  selectedPlan === plan.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50',
                  plan.popular ? 'border-primary' : ''
                ]"
                @click="selectedPlan = plan.id"
              >
                <!-- Popular badge -->
                <div
                  v-if="plan.popular"
                  class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full"
                >
                  Popular
                </div>

                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 rounded-lg bg-muted">
                    <component :is="plan.icon" class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="font-semibold">{{ plan.name }}</h4>
                    <p class="text-2xl font-bold">{{ plan.price }}</p>
                  </div>
                </div>

                <p class="text-sm text-muted-foreground mb-4">{{ plan.description }}</p>

                <ul class="space-y-2">
                  <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2 text-sm">
                    <Check class="w-4 h-4 text-green-500" />
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t bg-accent flex justify-between items-center">
            <NuxtLink to="/submit">
              <UiButton variant="outline">Back</UiButton>
            </NuxtLink>
            <UiButton
              :disabled="isProcessing"
              @click="handleSelectPlan(selectedPlan)"
            >
              <svg
                v-if="isProcessing"
                class="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ selectedPlan === 'free' ? freeButtonText : 'Proceed to Payment' }}
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </LayoutContainer>
</template>
