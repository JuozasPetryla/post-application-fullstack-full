<template>
  <button class="base-button" @click.stop="triggerEvent">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  methods: {
    triggerEvent() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
.base-button {
  margin: 1rem;
  background: #123d94;
  height: 2.4rem;
  width: fit-content;
  border: none;
  color: white;
  font-size: 1rem;
  box-shadow: 1.5px 1.5px 1.5px 1.5px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.base-button:hover {
  cursor: pointer;
  transform: translateY(-3%);
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
}
.base-button:active {
  transform: translateY(0);
  box-shadow: 1.5px 1.5px 1.5px 1.5px rgba(0, 0, 0, 0.3);
}
</style>