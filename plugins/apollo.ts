// ./plugins/apollo.ts

export default defineNuxtPlugin((nuxtApp) => {
  const { githubToken } = useRuntimeConfig();
  nuxtApp.hook("apollo:auth", ({ client, token }) => {
    // `client` can be used to differentiate logic on a per client basis.
    // apply apollo client token
    // token.value = githubToken;
  });
});
