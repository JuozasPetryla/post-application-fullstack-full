<template>
  <header class="header">
    <p>Post application</p>
    <RouterLink to="/" class="router-link">Posts</RouterLink>
    <RouterLink to="/authors" class="router-link">Authors</RouterLink>
    <button
      @click="
        openModal();
        selectFormMode('create');
      "
    >
      New
    </button>
  </header>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  methods: {
    ...mapActions(["getModalButton", "openModal", "selectFormMode"]),
  },
  computed: {
    ...mapGetters(["modalButton"]),
  },
  created() {
    this.getModalButton();
  },
};
</script >

<style scoped>
.header {
  background-color: #123d94;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3.2rem;
}

p {
  margin: 0;
  font-size: 1.2rem;
  color: white;
  padding: 0.6rem;
}

button {
  font-size: 1.2rem;
  border: none;
  background-color: inherit;
  color: white;
  transition: all 0.3s ease;
}

button:hover,
button:active {
  cursor: pointer;
  color: rgb(180, 176, 176);
}

.router-link {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.router-link:hover,
.router-link:active {
  color: rgb(180, 176, 176);
}

.router-link-exact-active {
  color: rgb(180, 176, 176);
}
</style>