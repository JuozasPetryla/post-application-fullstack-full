<template>
  <div class="overlay">
    <dialog open>
      <header>
        <slot name="title"></slot>
      </header>
      <p>
        <slot name="information"></slot>
      </p>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </dialog>
  </div>
</template>

<script>
export default { name: "BaseInfoDialog" };
</script>

<style scoped>
dialog {
  position: absolute;
  border: none;
  z-index: 1;
  box-shadow: 1.5px 1.5px 1.5px 1.5px rgba(0, 0, 0, 0.3);
  top: 35%;
  padding: 0;
  padding: 0.6rem;
  width: 60%;
}

.overlay {
  z-index: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #000000da;
}

header {
  background-color: #123d94;
  color: white;
  font-size: 2rem;
  text-align: center;
}

p {
  margin-top: 1.2rem;
  font-size: 1.2rem;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
}
</style>