// ./nuxt.config.ts

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/apollo", "@nuxtjs/tailwindcss"],
  runtimeConfig: {
    githubURL: process.env.GITHUB_API,
    githubToken: process.env.GITHUB_TOKEN,
  },

  apollo: {
    authType: "Bearer",
    authHeader: "Authorization",
    tokenStorage: "cookie",
    clients: {
      default: {
        tokenName: "github_token",
        httpEndpoint: "https://api.github.com/graphql",
      },
    },
  },
});
