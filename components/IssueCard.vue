<!-- ./components/IssueCard.vue -->

<script setup>
// define props
const { issue } = defineProps(["issue"]);

// create reactive comments array
const comments = ref(issue.comments.nodes);

// mutation query to add comment to issue
const addCommentQuery = gql`
  mutation ($subjectID: ID!, $body: String!) {
    addComment(input: { subjectId: $subjectID, body: $body }) {
      clientMutationId
      commentEdge {
        node {
          body
          bodyHTML
          author {
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

// mutation variables
const variables = ref({
  subjectID: issue.id,
  body: "",
});

// loading state ref
const isLoading = ref(false);

// description useMutation to obtain mutate frunction and rename it to `addComment`
const { mutate: addComment } = useMutation(addCommentQuery, variables.value);

// function to create new comment
const createComment = async () => {
  // return if body is empty
  if (variables.value.body.trim() === "") return;

  // set loading state to true
  isLoading.value = true;
  try {
    // call addComment function to add comment
    const { data } = await addComment(variables.value);

    // add new comment to comments array
    comments.value.push(data.addComment.commentEdge.node);

    // reset variables comment body
    variables.value.body = "";
  } catch (error) {
    console.log({ error });
  }
  // set loading state to false
  isLoading.value = false;
};
</script>
<template>
  <article class="issue">
    <div class="wrapper">
      <header class="issue-header">
        <div class="wrapper">
          <div class="issue-title">
            <h2 class="font-bold text-4xl">
              {{ issue.title }} #{{ issue.number }}
            </h2>
          </div>
          <div class="issue-author author">
            <div class="img-cont w-6 h-6">
              <img :src="issue.author?.avatarUrl" alt="" />
            </div>
            <NuxtLink :to="issue.author?.url">
              {{ issue.author?.login }}
            </NuxtLink>
          </div>
        </div>
      </header>
      <hr />
      <div v-if="issue.bodyHTML" class="issue-body">
        <div class="wrapper">
          <div class="issue-body-html">
            <div v-html="issue.bodyHTML" />
          </div>
        </div>
      </div>
      <ul v-if="issue.comments.nodes.length" class="issue-comments">
        <li v-for="comment in issue.comments.nodes" :key="comment.id">
          <article class="issue-comment">
            <div class="wrapper">
              <div class="issue-comment-author author">
                <div class="img-cont w-6 h-6">
                  <img :src="comment.author?.avatarUrl" alt="" />
                </div>
                <NuxtLink :to="comment.author?.url">
                  {{ comment.author?.login }}
                </NuxtLink>
              </div>
              <hr />
              <div class="issue-comment-body">
                <div v-html="comment.bodyHTML" />
              </div>
            </div>
          </article>
        </li>
      </ul>
      <hr />
      <div class="new-comment-cont">
        <div class="wrapper">
          <div class="form-control !w-full">
            <label for="new-comment">Enter a comment</label>
            <textarea
              name="new-comment"
              id="new-comment"
              rows="2"
              class="w-full"
              v-model="variables.body"
            ></textarea>
          </div>
          <div class="action-cont">
            <button
              @click="createComment"
              :disbled="isLoading"
              class="cta !bg-teal-700 text-teal-100 !border-teal-800 focus:cursor-wait"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
<style scoped>
.issue {
  @apply bg-slate-50 rounded-xl;
}

.issue-header > .wrapper {
  @apply flex flex-col gap-2 p-4;
}

.author {
  @apply flex gap-1 items-center;
}

.issue-body {
  @apply p-4;
}

.issue-comments {
  @apply flex flex-col gap-4 p-4;
}

.issue-comment > .wrapper {
  @apply bg-slate-100 rounded-lg;
}

.issue-comment-author,
.issue-comment-body {
  @apply p-4;
}

.new-comment-cont {
  @apply p-4;
}

.new-comment-cont > .wrapper {
  /* @apply p-4 border border-slate-300 rounded-lg; */
}

.action-cont {
  @apply flex justify-end mt-4;
}
</style>
