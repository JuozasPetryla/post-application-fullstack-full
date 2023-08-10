<template>
  <div>
    <component
      v-if="createModalIsOpen"
      :is="dialog"
      class="modal-dynamic-component"
    ></component>
    <section class="articles-container">
      <TheSearchBar></TheSearchBar>
      <ThePagination v-if="totalPosts"></ThePagination>
      <ArticleCard
        v-for="post in searchTerm ? searchedPostsWithAuthors : postsWithAuthors"
        :author="`${post.author.name} ${post.author.surname}`"
        :key="post.id"
        :title="post.title"
        :date="
          post.created_at !== post.updated_at
            ? post.updated_at
            : post.created_at
        "
        :id="post.id"
        @clickCard="getPostId(post.id)"
        class="article-card"
      />
      <h2 v-if="!totalPosts">There are no posts here</h2>
    </section>
  </div>
</template>

<script>
import ArticleCreateModal from "../components/article/ArticleCreateModal.vue";
import ArticleEditModal from "../components/article/ArticleEditModal.vue";
import ArticleCard from "../components/article/ArticleCard.vue";
import TheSearchBar from "../components/layout/TheSearchBar.vue";
import ThePagination from "../components/layout/ThePagination.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    ArticleCard,
    ThePagination,
    ArticleCreateModal,
    ArticleEditModal,
    TheSearchBar,
  },

  computed: {
    ...mapGetters([
      "postsWithAuthors",
      "formMode",
      "createModalIsOpen",
      "searchTerm",
      "totalPosts",
      "searchedPostsWithAuthors",
    ]),
    dialog() {
      if (this.formMode === "create") {
        return ArticleCreateModal;
      }
      if (this.formMode === "edit") {
        return ArticleEditModal;
      }
    },
  },
  watch: {
    "$store.state.posts.totalPosts": {
      deep: true,
      handler() {
        if (!this.searchTerm) {
          this.getPages();
        } else {
          this.getPages();
        }
      },
    },
    "$store.state.pagination.pages": {
      deep: true,
      handler() {
        if (!this.searchTerm) {
          this.getCurrentPage();
        } else {
          this.getCurrentPage();
        }
      },
    },
    "$store.state.pagination.currentPage": {
      deep: true,
      handler() {
        if (!this.searchTerm) {
          this.getPostsWithAuthors();
        } else {
          this.getSearchedPostsWithAuthors();
        }
      },
    },
    "$store.state.search.searchTerm": {
      deep: true,
      handler() {
        this.getSearchedPostsWithAuthors();
        this.getPages();
      },
    },
  },
  methods: {
    ...mapActions([
      "getPostsWithAuthors",
      "getPostDetailId",
      "closeInfoModal",
      "getCurrentPostWithAuthor",
      "getSearchedPostsWithAuthors",
      "getPages",
      "getAuthors",
      "getPosts",
      "getCurrentPage",
    ]),
    getPostId(id) {
      this.getPostDetailId(id);
      this.getCurrentPostWithAuthor(id);
      this.$router.push(`/postDetail/${id}`);
    },
  },
  created() {
    this.getAuthors();
    this.getPostsWithAuthors();
  },
};
</script>

<style scoped>
.articles-container {
  display: flex;
  margin-top: 1.2rem;
  flex-direction: column;
  gap: 1.2rem;
}

h2 {
  text-align: center;
  font-size: 3.2rem;
}
</style>
