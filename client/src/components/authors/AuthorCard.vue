<template>
  <BaseCard v-if="totalAuthors" class="author-card" @click="triggerEvent">
    <h2>{{ author }}</h2>
    <p>{{ date }}</p>
    <div>
      <BaseButton
        class="editButton"
        @click="
          openModal();
          selectFormMode('edit');
          getAuthorEditId(id);
        "
        >Edit author</BaseButton
      >
      <BaseButton
        class="deleteButton"
        @click="
          openInfoModalAuthor();
          getAuthorDeleteId(id);
        "
        >Delete author</BaseButton
      >
    </div>
  </BaseCard>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["author", "date", "id"],
  name: "AuthorCard",
  methods: {
    ...mapActions([
      "openModal",
      "selectFormMode",
      "openInfoModalAuthor",
      "getAuthorEditId",
      "getAuthorDeleteId",
      "getAuthors",
    ]),
    triggerEvent() {
      this.$emit("clickCard");
    },
  },
  computed: {
    ...mapGetters(["totalAuthors"]),
  },
};
</script>
  
  <style scoped>
.author-card:hover,
.author-card:active {
  cursor: pointer;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  transform: translateY(-3%);
}

.author-card:active {
  transform: translateY(0%);
  box-shadow: 1.5px 1.5px 1.5px 1.5px rgba(0, 0, 0, 0.3);
}
</style>