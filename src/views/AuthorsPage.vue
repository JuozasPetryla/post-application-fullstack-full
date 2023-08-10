<template>
  <div>
    <component
      v-if="createModalIsOpen"
      :is="dialog"
      class="modal-dynamic-component"
    ></component>
    <section class="authors-container">
      <ThePagination v-if="totalAuthors"></ThePagination>
      <AuthorCard
        v-for="author in authors"
        :author="`${author.name} ${author.surname}`"
        :key="author.id"
        :date="
          author.created_at !== author.updated_at
            ? author.updated_at
            : author.created_at
        "
        :id="author.id"
        @clickCard="getAuthorId(author.id)"
        class="author-card"
      />
      <h2 v-if="!totalAuthors">There are no authors here</h2>
    </section>
  </div>
</template>
  
  <script>
import AuthorCreateModal from "../components/authors/AuthorCreateModal.vue";
import AuthorEditModal from "../components/authors/AuthorEditModal.vue";
import AuthorCard from "../components/authors/AuthorCard.vue";
import ThePagination from "../components/layout/ThePagination.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    AuthorCard,
    ThePagination,
    AuthorCreateModal,
    AuthorEditModal,
  },

  computed: {
    ...mapGetters(["authors", "formMode", "createModalIsOpen", "totalAuthors"]),
    dialog() {
      if (this.formMode === "create") {
        return AuthorCreateModal;
      }
      if (this.formMode === "edit") {
        return AuthorEditModal;
      }
    },
  },
  watch: {
    "$store.state.authors.totalAuthors": {
      deep: true,
      handler() {
        this.getPages();
      },
    },
    "$store.state.pagination.pages": {
      deep: true,
      handler() {
        this.getCurrentPage();
      },
    },
    "$store.state.pagination.currentPage": {
      deep: true,
      handler() {
        this.getAuthors();
      },
    },
  },
  methods: {
    ...mapActions([
      "getAuthorDetailId",
      "closeInfoModal",
      "getCurrentAuthorWithPosts",
      "getPages",
      "getAuthors",
      "getCurrentPage",
      "getPosts",
    ]),
    getAuthorId(id) {
      this.getAuthorDetailId(id);
      this.getCurrentAuthorWithPosts(id);
      this.$router.push(`/authorDetail/${id}`);
    },
  },
  created() {
    this.getAuthors();
  },
};
</script>
  
  <style scoped>
.authors-container {
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
  