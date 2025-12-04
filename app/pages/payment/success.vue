<script setup lang="ts">
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-vue-next';

const route = useRoute();

// Get query parameters
const provider = computed(() => route.query.provider as string);
const checkoutId = computed(() => route.query.checkout_id as string);
const orderId = computed(() => route.query.order_id as string);
const customerId = computed(() => route.query.customer_id as string);
const productId = computed(() => route.query.product_id as string);
const sessionId = computed(() => route.query.session_id as string); // For Stripe

const isLoading = ref(true);
const paymentVerified = ref(false);
const error = ref<string | null>(null);

// Verify payment on mount
onMounted(async () => {
  try {
    // For now, we trust the redirect from payment provider
    // In production, you should verify the payment via webhook or API call
    paymentVerified.value = true;
  } catch (e) {
    error.value = 'Failed to verify payment';
    console.error('Payment verification error:', e);
  } finally {
    isLoading.value = false;
  }
});

useSeoMeta({
  title: 'Payment Successful - Directory Template',
  description: 'Your payment was successful.',
});
</script>

<template>
  <LayoutContainer class="py-16">
    <div class="max-w-lg mx-auto text-center">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center gap-4">
        <Loader2 class="w-12 h-12 animate-spin text-primary" />
        <p class="text-muted-foreground">Verifying payment...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="paymentVerified" class="flex flex-col items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle class="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <div class="space-y-2">
          <h1 class="text-2xl font-bold">Payment Successful!</h1>
          <p class="text-muted-foreground">
            Thank you for your purchase. Your submission is now being processed.
          </p>
        </div>

        <!-- Payment Details -->
        <div class="w-full p-4 rounded-lg bg-muted/50 text-left space-y-2 text-sm">
          <div v-if="provider" class="flex justify-between">
            <span class="text-muted-foreground">Provider</span>
            <span class="font-medium capitalize">{{ provider }}</span>
          </div>
          <div v-if="orderId" class="flex justify-between">
            <span class="text-muted-foreground">Order ID</span>
            <span class="font-mono text-xs">{{ orderId }}</span>
          </div>
          <div v-if="checkoutId" class="flex justify-between">
            <span class="text-muted-foreground">Checkout ID</span>
            <span class="font-mono text-xs">{{ checkoutId }}</span>
          </div>
          <div v-if="sessionId" class="flex justify-between">
            <span class="text-muted-foreground">Session ID</span>
            <span class="font-mono text-xs">{{ sessionId }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <NuxtLink to="/dashboard" class="flex-1">
            <UiButton variant="outline" class="w-full">
              Go to Dashboard
            </UiButton>
          </NuxtLink>
          <NuxtLink to="/" class="flex-1">
            <UiButton class="w-full">
              Back to Home
              <ArrowRight class="w-4 h-4 ml-2" />
            </UiButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="flex flex-col items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <span class="text-4xl">❌</span>
        </div>

        <div class="space-y-2">
          <h1 class="text-2xl font-bold">Payment Verification Failed</h1>
          <p class="text-muted-foreground">{{ error }}</p>
        </div>

        <NuxtLink to="/dashboard">
          <UiButton>Go to Dashboard</UiButton>
        </NuxtLink>
      </div>
    </div>
  </LayoutContainer>
</template>
