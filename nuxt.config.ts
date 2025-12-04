// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

// Trigger rebuild for config changes - TS installed
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['./app/assets/css/main.css'],
  devtools: { enabled: true },
  
  modules: [
    '@nuxthub/core',
    '@nuxtjs/color-mode',
    '@nuxtjs/sanity',
  ],

  hub: {
    // NuxtHub configuration
    // https://hub.nuxt.com/docs/getting-started/deploy
  },

  sanity: {
    projectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NUXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    visualEditing: {
      studioUrl: '/studio',
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Server-side only (private)
    sanityApiToken: process.env.NUXT_SANITY_API_TOKEN,
    resendApiKey: process.env.NUXT_RESEND_API_KEY,
    resendEmailFrom: process.env.NUXT_RESEND_EMAIL_FROM || 'onboarding@resend.dev',
    resendEmailAdmin: process.env.NUXT_RESEND_EMAIL_ADMIN,
    stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.NUXT_STRIPE_WEBHOOK_SECRET,
    creemApiKey: process.env.NUXT_CREEM_API_KEY,
    creemWebhookSecret: process.env.NUXT_CREEM_WEBHOOK_SECRET,
    creemTestMode: process.env.NUXT_CREEM_TEST_MODE === 'true',
    authSecret: process.env.NUXT_AUTH_SECRET,
    authGoogleClientId: process.env.NUXT_AUTH_GOOGLE_CLIENT_ID,
    authGoogleClientSecret: process.env.NUXT_AUTH_GOOGLE_CLIENT_SECRET,
    authGithubClientId: process.env.NUXT_AUTH_GITHUB_CLIENT_ID,
    authGithubClientSecret: process.env.NUXT_AUTH_GITHUB_CLIENT_SECRET,
    googleAiApiKey: process.env.NUXT_GOOGLE_AI_API_KEY,
    deepseekApiKey: process.env.NUXT_DEEPSEEK_API_KEY,
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    aiProvider: process.env.NUXT_AI_PROVIDER || 'google',

    // Client-side (public)
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      sanityProjectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID,
      sanityDataset: process.env.NUXT_PUBLIC_SANITY_DATASET || 'production',
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      stripeProPriceId: process.env.NUXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      stripeSponsorPriceId: process.env.NUXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID,
      creemProProductId: process.env.NUXT_PUBLIC_CREEM_PRO_PRODUCT_ID,
      creemSponsorProductId: process.env.NUXT_PUBLIC_CREEM_SPONSOR_PRODUCT_ID,
      googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID,
      // Feature flags
      supportCategoryGroup: process.env.NUXT_PUBLIC_SUPPORT_CATEGORY_GROUP !== 'false', // default true
      supportItemIcon: process.env.NUXT_PUBLIC_SUPPORT_ITEM_ICON !== 'false', // default true
      supportAiSubmit: process.env.NUXT_PUBLIC_SUPPORT_AI_SUBMIT === 'true', // default false
      itemsPerPage: Number(process.env.NUXT_PUBLIC_ITEMS_PER_PAGE) || 12,
    },
  },

  app: {
    head: {
      title: 'Nuxt Mkdirs - The Best Directory Website Template for Nuxt',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'This is the Nuxt.js version of Mkdirs template. The ultimate directory website template built with Nuxt.' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
