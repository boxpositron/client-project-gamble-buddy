// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    "@nuxtjs/google-fonts",
    "@pinia-plugin-persistedstate/nuxt",
    [
      "@pinia/nuxt",
      {
        disableVuex: true,
        autoImports: ["acceptHMRUpdate"],
      },
    ],
  ],
  plugins: ["plugins/fontawesome.ts"],
  pinia: {
    storesDirs: ["stores"],
  },
  googleFonts: {
    display: "swap",
    preconnect: true,
    families: {
      Jost: true,
    },
  },
  vite: {
    server: {
      hmr: {
        protocol: "ws",
        host: "0.0.0.0",
      },
    },
  },
  build: {
    transpile: ["@fortawesome/vue-fontawesome"],
  },
})
