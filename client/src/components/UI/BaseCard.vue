<template>
  <div class="card" v-on:click="triggerEvent">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',

  methods: {
    triggerEvent() {
      this.$emit("click");
    },
  },
};
</script>

<style>
.card {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-shadow: 1.5px 1.5px 1.5px 1.5px rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: center;
  width: 70%;
  gap: 1.2rem;
  transition: all 0.3s ease;
}
</style>