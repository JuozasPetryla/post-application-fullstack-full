<template>
  <div class="detail-container">
    <component
      class=".modal-dynamic-component"
      v-if="createModalIsOpen"
      :is="dialog"
    ></component>
    <BaseCard>
      <h2>
        {{
          `${currentAuthorDetailWithPosts.name} ${currentAuthorDetailWithPosts.surname}`
        }}
      </h2>
      <p class="author-body">{{ currentAuthorDetailWithPosts.body }}</p>
      <p class="author-date">
        {{
          currentAuthorDetailWithPosts.updated_at !==
          currentAuthorDetailWithPosts.created_at
            ? currentAuthorDetailWithPosts.updated_at
            : currentAuthorDetailWithPosts.created_at
        }}
      </p>
      <div>
        <BaseButton
          class="edit-btn"
          @click="
            openModal();
            selectFormMode('edit');
            getAuthorEditId(currentAuthorDetailWithPosts.id);
          "
          >Edit author</BaseButton
        >
        <BaseButton
          class="delete-btn"
          @click="
            openInfoModalAuthor();
            getAuthorDeleteId(currentAuthorDetailWithPosts.id);
          "
          >Delete author</BaseButton
        >
      </div>
    </BaseCard>
    <BaseButton class="back-btn" v-on:click="goBackToAuthors"
      >Go back</BaseButton
    >
    <h2>Author posts</h2>
    <p v-if="currentAuthorDetailWithPosts.posts?.length === 0">
      Author has no posts yet!
    </p>
    <ArticleCard
      v-for="post in currentAuthorDetailWithPosts.posts"
      :key="post.id"
      :title="post.title"
      :date="
        post.created_at !== post.updated_at ? post.updated_at : post.created_at
      "
      :id="post.id"
      @clickCard="getPostId(post.id)"
      class="article-card"
    />
  </div>
</template>
  
  <script>
import ArticleCard from "../components/article/ArticleCard.vue";
import AuthorCreateModal from "../components/authors/AuthorCreateModal.vue";
import AuthorEditModal from "../components/authors/AuthorEditModal.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    AuthorCreateModal,
    AuthorEditModal,
    ArticleCard,
  },
  computed: {
    ...mapGetters([
      "currentAuthorDetailWithPosts",
      "authorDetailId",
      "formMode",
      "createModalIsOpen",
      "deleteId",
      "authors",
    ]),

    dialog() {
      if (this.formMode === "create") {
        return AuthorCreateModal;
      }
      if (this.formMode === "edit") {
        return AuthorEditModal;
      }
    },
  },
  methods: {
    ...mapActions([
      "openModal",
      "selectFormMode",
      "openInfoModalAuthor",
      "getCurrentAuthorWithPosts",
      "getAuthorDeleteId",
      "getAuthorEditId",
      "getPostDetailId",
      "getCurrentPostWithAuthor",
    ]),
    goBackToAuthors() {
      this.$router.go(-1);
    },
    getPostId(id) {
      this.getPostDetailId(id);
      this.getCurrentPostWithAuthor(id);
      this.$router.push(`/postDetail/${id}`);
    },
  },
  created() {
    this.getCurrentAuthorWithPosts(this.authorDetailId);
  },
};
</script>
  
  <style scoped>
h2 {
  font-size: 2.4rem;
}

p {
  font-size: 1.2rem;
}
.detail-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.article-card {
  margin-top: 1.2rem;
}
</style>
  