// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    '@/assets/css/tailwind.css',
  ],
  modules: ['nuxt-proxy'],
  // See options here https://github.com/chimurai/http-proxy-middleware#options
  proxy: {
    options: {
      target: process.env.BACKEND_URL,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      pathFilter: [
        '/api'
      ],
    }
  },

  runtimeConfig: {
    public: {
      BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
