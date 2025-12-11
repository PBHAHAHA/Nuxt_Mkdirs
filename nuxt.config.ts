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
    '@nuxtjs/sitemap',
  ],

  // Sitemap configuration
  // https://nuxtseo.com/sitemap/getting-started/installation
  sitemap: {
    // Exclude admin/dashboard routes from sitemap
    exclude: [
      '/dashboard/**',
      '/studio/**',
      '/auth/**',
    ],
  },


  hub: {
    // NuxtHub configuration
    // https://hub.nuxt.com/docs/getting-started/deploy
  },

  // Sanity configuration
  // projectId and dataset are read from sanity.config.ts automatically
  sanity: {
    useCdn: false,
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  // Runtime config for environment variables
  // Nuxt automatically maps NUXT_* env vars to runtimeConfig
  // https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables
  runtimeConfig: {
    // Sanity config (used by @nuxtjs/sanity module)
    sanity: {
      token: '', // NUXT_SANITY_TOKEN
    },

    // Server-side only (private) - auto-mapped from NUXT_*
    // e.g., NUXT_SANITY_API_TOKEN -> sanityApiToken
    sanityApiToken: '',
    resendApiKey: '',
    resendEmailFrom: 'onboarding@resend.dev',
    resendEmailAdmin: '',
    resendAudienceId: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    creemApiKey: '',
    creemWebhookSecret: '',
    creemTestMode: false,
    authSecret: '',
    authGoogleClientId: '',
    authGoogleClientSecret: '',
    authGithubClientId: '',
    authGithubClientSecret: '',

    // Client-side (public) - auto-mapped from NUXT_PUBLIC_*
    // e.g., NUXT_PUBLIC_APP_URL -> public.appUrl
    public: {
      appUrl: 'http://localhost:3000',
      sanityProjectId: '',
      sanityDataset: 'production',
      stripePublishableKey: '',
      stripeProPriceId: '',
      stripeSponsorPriceId: '',
      creemProProductId: '',
      creemSponsorProductId: '',
      googleAnalyticsId: '',
      // Feature flags (these need special handling for boolean/number)
      supportCategoryGroup: true,
      supportItemIcon: true,
      supportAiSubmit: false,
      itemsPerPage: 12,
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
