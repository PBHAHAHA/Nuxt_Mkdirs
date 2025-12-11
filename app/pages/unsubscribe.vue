<script setup lang="ts">
import { MailX, CheckCircle, AlertCircle } from 'lucide-vue-next';

const route = useRoute();
const email = computed(() => route.query.email as string || '');

const isLoading = ref(false);
const isUnsubscribed = ref(false);
const errorMessage = ref('');

async function handleUnsubscribe() {
  if (!email.value) {
    errorMessage.value = 'Email is required';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await $fetch('/api/newsletter/unsubscribe', {
      method: 'POST',
      body: { email: email.value },
    });

    isUnsubscribed.value = true;
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to unsubscribe. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

useSeo({
  title: 'Unsubscribe',
  description: 'Unsubscribe from our newsletter',
  noIndex: true,
});
</script>

<template>
  <LayoutContainer class="mt-12 mb-16">
    <div class="max-w-md mx-auto text-center">
      <!-- Success State -->
      <div v-if="isUnsubscribed" class="flex flex-col items-center gap-6">
        <div class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle class="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 class="text-2xl font-bold mb-2">You've been unsubscribed</h1>
          <p class="text-muted-foreground">
            You will no longer receive our newsletter emails.
          </p>
        </div>
        <NuxtLink to="/" class="text-primary hover:underline">
          Return to homepage
        </NuxtLink>
      </div>

      <!-- Unsubscribe Form -->
      <div v-else class="flex flex-col items-center gap-6">
        <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <MailX class="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h1 class="text-2xl font-bold mb-2">Unsubscribe from Newsletter</h1>
          <p class="text-muted-foreground">
            Are you sure you want to unsubscribe from our newsletter?
          </p>
        </div>

        <div v-if="email" class="w-full">
          <p class="text-sm text-muted-foreground mb-4">
            Email: <span class="font-medium text-foreground">{{ email }}</span>
          </p>
          
          <button
            @click="handleUnsubscribe"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ isLoading ? 'Unsubscribing...' : 'Confirm Unsubscribe' }}
          </button>

          <p v-if="errorMessage" class="mt-4 text-sm text-red-500">
            {{ errorMessage }}
          </p>
        </div>

        <div v-else class="w-full">
          <div class="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertCircle class="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              Invalid unsubscribe link. Please use the link from your email.
            </p>
          </div>
        </div>

        <NuxtLink to="/" class="text-sm text-muted-foreground hover:text-primary">
          Cancel and return to homepage
        </NuxtLink>
      </div>
    </div>
  </LayoutContainer>
</template>
