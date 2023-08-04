<template>
  
    <div class="notification">
      <BaseButton class="close-btn" @click="closeNotification">X</BaseButton>
      <slot>Some action was done</slot>
    </div>
  
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["closeNotification"]),
  },
};
</script>

<style scoped>
.notification {
  position: absolute;
  background: green;
  display: flex;
  top: 0.5%;
  left: 5%;
  height: 7rem;
  width: 15rem;
  text-align: center;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 1rem;
  justify-content: center;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 5%;
  left: 5%;
  height: 1.4rem;
  width: 1.4rem;
  margin: 0;
}


</style>