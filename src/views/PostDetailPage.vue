<template>
  <div class="detail-container">
    <component
      class=".modal-dynamic-component"
      v-if="createModalIsOpen"
      :is="dialog"
    ></component>
    <BaseCard>
      <h1>{{ currentPostDetailWithAuthor.title }}</h1>
      <h2>
        {{
          `${currentPostDetailWithAuthor.author?.name} ${currentPostDetailWithAuthor.author?.surname}`
        }}
      </h2>
      <p class="post-body">{{ currentPostDetailWithAuthor.body }}</p>
      <p class="post-date">
        {{
          currentPostDetailWithAuthor.updated_at !==
          currentPostDetailWithAuthor.created_at
            ? currentPostDetailWithAuthor.updated_at
            : currentPostDetailWithAuthor.created_at
        }}
      </p>
      <div>
        <BaseButton
          class="edit-btn"
          @click="
            openModal();
            selectFormMode('edit');
            getEditId(currentPostDetailWithAuthor.id);
          "
          >Edit article</BaseButton
        >
        <BaseButton
          class="delete-btn"
          @click="
            openInfoModalPost();
            getDeleteId(currentPostDetailWithAuthor.id);
          "
          >Delete Post</BaseButton
        >
      </div>
    </BaseCard>
    <BaseButton class="back-btn" v-on:click="goBackToPosts">Go back</BaseButton>
  </div>
</template>

<script>
import ArticleCreateModal from "../components/article/ArticleCreateModal.vue";
import ArticleEditModal from "../components/article/ArticleEditModal.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    ArticleCreateModal,
    ArticleEditModal,
  },
  computed: {
    ...mapGetters([
      "currentPostDetailWithAuthor",
      "postDetailId",
      "formMode",
      "createModalIsOpen",
      "deleteId",
      "authors",
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
  methods: {
    ...mapActions([
      "openModal",
      "selectFormMode",
      "openInfoModalPost",
      "getCurrentPostWithAuthor",
      "getDeleteId",
      "getEditId",
    ]),
    goBackToPosts() {
      this.$router.go(-1);
    },
  },
  created() {
    this.getCurrentPostWithAuthor(this.postDetailId);
  },
};
</script>

<style scoped>
.detail-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
