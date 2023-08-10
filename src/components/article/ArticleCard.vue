<template>
  <BaseCard v-if="totalPosts" class="article-card" @click="triggerEvent">
    <h2>{{ author }}</h2>
    <h3>{{ title }}</h3>
    <p>{{ date }}</p>
    <div>
      <BaseButton
        class="editButton"
        @click="
          openModal();
          selectFormMode('edit');
          getEditId(id);
        "
        >Edit article</BaseButton
      >
      <BaseButton
        class="deleteButton"
        @click="
          openInfoModalPost();
          getDeleteId(id);
        "
        >Delete post</BaseButton
      >
    </div>
  </BaseCard>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["author", "title", "date", "id"],
  name: "ArticleCard",
  methods: {
    ...mapActions([
      "openModal",
      "selectFormMode",
      "openInfoModalPost",
      "getEditId",
      "getDeleteId",
    ]),
    triggerEvent() {
      this.$emit("clickCard");
    },
  },
  computed: {
    ...mapGetters(["totalPosts"]),
  },
};
</script>

<style scoped>
.article-card:hover,
.article-card:active {
  cursor: pointer;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  transform: translateY(-3%);
}

.article-card:active {
  transform: translateY(0%);
  box-shadow: 1.5px 1.5px 1.5px 1.5px rgba(0, 0, 0, 0.3);
}
</style>