export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    configPath: '~/tailwind.config.js',
  },

  compatibilityDate: '2025-02-20',
});