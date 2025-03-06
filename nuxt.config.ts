// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    '@/assets/css/tailwind.css',
  ],
  modules: ['nuxt-proxy', '@nuxt/ui', '@nuxtjs/color-mode'],
  // ui: {
  //   notifications: {
  //     position: 'top-0 bottom-auto'
  //   }
  // },
  nitro: {
    devProxy: {
      "/api/": {
        target: process.env.BACKEND_URL,
        changeOrigin: true
      },
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});