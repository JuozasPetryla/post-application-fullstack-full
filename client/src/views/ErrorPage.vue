<template>
  <BaseCard class="card">
    <h2 v-if="errorMessage">{{ errorMessage }}</h2>
    <h2 v-else>Page does not exist</h2>
  </BaseCard>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["errorMessage"]),
  },
};
</script>

<style scoped>
.card {
  height: 10rem;
  margin-top: 2.4rem;
  text-align: center;
}
h2 {
  margin: auto 0;
  font-size: 2.4rem;
}
</style>