<!-- ./app.vue -->

<script setup>
const github_token = useCookie("github_token");

// define query
const query = gql`
  query ($name: String!, $owner: String!, $limit: Int) {
    repository(name: $name, owner: $owner) {
      issues(first: $limit) {
        nodes {
          id
          title
          body
          bodyHTML
          number
          comments(first: 5) {
            nodes {
              body
              bodyHTML
              author {
                login
                avatarUrl
              }
            }
          }
          author {
            login
            url
            avatarUrl
          }
        }
        edges {
          cursor
        }
        totalCount
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

// define variables
const variables = ref({
  name: "discussions",
  owner: "miracleonyenma",
  limit: 10,
});

const token = ref(github_token.value);

const { data, error, refresh } = useAsyncQuery(query, variables.value);

const loadMore = () => {
  if (data.value.repository.issues.pageInfo.hasNextPage) {
    variables.value.limit = variables.value.limit + 10;
    refresh(variables.value);
  }
};

const saveToken = () => {
  github_token.value = token.value;
};

console.log({ data, error });

useHead({
  title: "Issues viewer",
  meta: [
    {
      name: "description",
      content: "Issues viewer",
    },
  ],
});
</script>
<template>
  <main>
    <header class="issues-header site-section">
      <div class="wrapper">
        <h1 class="font-semibold text-2xl">Issues viewer</h1>
        <div class="settings-container grid grid-cols-2">
          <div class="wrapper">
            <form class="my-2">
              <div class="wrapper">
                <div class="form-group">
                  <div class="form-control">
                    <label for="repository-name"> Repository name </label>
                    <input
                      type="text"
                      id="repository-name"
                      v-model="variables.name"
                      placeholder="Repository name"
                    />
                  </div>
                  <div class="form-control">
                    <label for="repository-owner"> Repository owner </label>
                    <input
                      type="text"
                      id="repository-owner"
                      v-model="variables.owner"
                      placeholder="Repository owner"
                    />
                  </div>
                </div>
              </div>
            </form>
            <button @click="refresh" class="cta">Refresh</button>
          </div>
          <div class="wrapper">
            <div class="form-cont">
              <form class="my-2 ml-auto">
                <div class="form-control">
                  <label for="token">Your GitHub Token</label>
                  <input v-model="token" type="text" name="token" id="token" />
                  <span class="text-xs">
                    Find out how to get a
                    <a
                      class="underline text-blue-600"
                      href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
                      target="_blank"
                      rel="noopener noreferrer"
                      >personal access token</a
                    >
                  </span>
                </div>
              </form>
              <button @click="saveToken" type="button" class="cta">Save</button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="site-section issues-section">
      <div v-if="data?.repository" class="wrapper">
        <ul class="issues">
          <li v-for="issue in data.repository.issues.nodes" :key="issue.id">
            <IssueCard :issue="issue" />
          </li>
        </ul>
        <div class="action-cont">
          <button
            class="cta focus:cursor-wait"
            @click="loadMore"
            :disabled="!data.repository.issues.pageInfo.hasNextPage"
          >
            Load more
          </button>
        </div>
      </div>
      <div v-else>
        <p class="text-center">No issues found or something's not right 🥲</p>
      </div>
    </section>
  </main>
</template>
<style scoped>
.issues-header {
  @apply p-4 py-12;
}
.issues-section {
  @apply w-full p-4 pb-12;
}
.issues {
  @apply grid grid-cols-1 gap-4;
}

.action-cont {
  @apply flex justify-center p-6;
}
</style>
