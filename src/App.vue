<template>
  <div id="app">
    <transition name="fade">
      <BaseNotification v-if="notificationOpen">
        {{ notificationText }}
      </BaseNotification>
    </transition>
    <TheHeader />
    <BaseInfoDialog v-if="infoModalIsOpen">
      <template v-slot:title> {{ infoModalTitle }} </template>
      <template v-slot:information> {{ infoModalText }}</template>
      <template v-slot:actions>
        <BaseButton
          v-if="infoModalMode === 'deletePost'"
          @click="
            closeInfoModal();
            deletePost(deleteId);
            goBack();
          "
          >Delete</BaseButton
        >
        <BaseButton
          v-if="infoModalMode === 'deleteAuthor'"
          @click="
            closeInfoModal();
            deleteAuthor(authorDeleteId);
            goBack();
          "
          >Delete</BaseButton
        >
        <BaseButton @click="closeInfoModal">Close</BaseButton>
      </template>
    </BaseInfoDialog>
    <RouterView></RouterView>
  </div>
</template>

<script>
import TheHeader from "./components/layout/TheHeader.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    TheHeader,
  },
  computed: {
    ...mapGetters([
      "infoModalIsOpen",
      "infoModalText",
      "infoModalTitle",
      "infoModalMode",
      "deleteId",
      "authorDeleteId",
      "notificationOpen",
      "notificationText",
    ]),
  },
  methods: {
    ...mapActions([
      "closeInfoModal",
      "deletePost",
      "deleteAuthor",
      "getAuthors",
      "closeNotification",
    ]),
    goBack() {
      this.$store.commit("setInfoModalMode", "");
      if (this.$router.currentRoute.path === "/authorDetail:id") {
        this.$router.push("/authors");
      }
      if (this.$router.currentRoute.path === "/postDetail/:id") {
        this.$router.push("/");
      }
    },
  },
  updated() {
    this.getAuthors();
  },
};
</script>

<style scoped>
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10%);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
</style>



