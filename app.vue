<!-- ./app.vue -->

<script setup>
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

const { data, error, refresh } = useAsyncQuery(query, variables.value);

const loadMore = () => {
  if (data.value.repository.issues.pageInfo.hasNextPage) {
    variables.value.limit = variables.value.limit + 10;
    refresh(variables.value);
  }
};

console.log({ data, error });
</script>
<template>
  <main>
    <header class="issues-header site-section">
      <div class="wrapper">
        <h1 class="font-semibold text-2xl">Issues viewer</h1>
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
    </header>
    <section class="site-section issues-section">
      <div class="wrapper">
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
