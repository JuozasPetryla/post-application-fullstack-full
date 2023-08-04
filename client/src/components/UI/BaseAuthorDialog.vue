<template>
  <div class="overlay">
    <dialog open>
      <header>
        <slot name="header"></slot>
      </header>
      <form @submit.prevent="formSubmit">
        <div class="form-control">
          <label for="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            v-model="name"
            :class="{ invalid: !nameIsValid }"
            @blur="validateName"
            @input="validateName"
          />
          <p v-if="!nameIsValid">Please enter a surname</p>
        </div>
        <div class="form-control">
          <label for="surname">Surname:</label>
          <input
            type="text"
            name="surname"
            id="surname"
            v-model="surname"
            :class="{ invalid: !surnameIsValid }"
            @blur="validateSurname"
            @input="validateSurname"
          />
          <p v-if="!surnameIsValid">Please enter a surname</p>
        </div>
        <div class="form-buttons">
          <BaseButton
            class="submit-button"
            type="submit"
            @click="
              formMode === 'create' ? validateCreateForm() : validateEditForm()
            "
          >
            <slot name="button"> Submit </slot>
          </BaseButton>
          <BaseButton @click="closeModal" class="close-btn"
            >Close Modal</BaseButton
          >
        </div>
      </form>
    </dialog>
  </div>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "BaseDialog",

  data() {
    return {
      name: "",
      surname: "",
      nameIsValid: true,
      surnameIsValid: true,
      formIsValid: false,
    };
  },
  computed: {
    ...mapGetters(["formMode", "authorEditId"]),
  },
  methods: {
    ...mapActions([
      "closeModal",
      "createNewAuthor",
      "editAuthor",
      "getAuthorsWithPosts",
    ]),
    formSubmit() {
      if (!this.formIsValid) return;
      if (this.formMode === "create") {
        this.createNewAuthor({
          name: this.name,
          surname: this.surname,
          created_at: new Date().toLocaleString(),
          updated_at: new Date().toLocaleString(),
        });
      }
      if (this.formMode === "edit") {
        this.editAuthor({
          name: this.name,
          surname: this.surname,
          id: this.authorEditId,
          updated_at: new Date().toISOString().slice(0, 10),
        });
      }
      this.closeModal();
      if (this.$router.currentRoute.path !== "/authors") {
        this.$router.push("/authors");
      }
      this.getAuthorsWithPosts();
    },
    validateCreateForm() {
      this.validateName();
      this.validateSurname();
      if (this.nameIsValid && this.surnameIsValid) {
        this.formIsValid = true;
      } else {
        this.formIsValid = false;
      }
    },
    validateEditForm() {
      this.validateName();
      this.validateSurname();
      if (this.nameIsValid && this.surnameIsValid) {
        this.formIsValid = true;
      } else {
        this.formIsValid = false;
      }
    },
    validateName() {
      if (this.name) {
        this.nameIsValid = true;
      } else {
        this.nameIsValid = false;
      }
    },
    validateSurname() {
      if (this.surname) {
        this.surnameIsValid = true;
      } else {
        this.surnameIsValid = false;
      }
    },
  },
};
</script>
  
  <style scoped>
header {
  color: white;
  font-size: 1.2rem;
  text-align: center;
  padding: 0.2rem 0;
  width: 100%;
  background: #123d94;
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

dialog {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 25%;
  width: 27.5rem;
  height: 20rem;
  z-index: 1;
  padding: 0;
  border: none;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20rem;
  height: 18rem;
  justify-content: center;
  gap: 1.2rem;
}

.form-control {
  display: flex;
  justify-content: space-between;
  text-align: start;
  width: 100%;
  position: relative;
}
.form-control label {
  font-size: 1.2rem;
}

.form-control input,
.form-control select,
.form-control textarea {
  width: 10rem;
}

.form-control select {
  font-size: 1rem;
  padding: 2px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.invalid {
  border: 1px solid red;
  background: rgba(255, 0, 0, 0.062);
}
p {
  position: absolute;
  color: red;
  top: 100%;
  right: 0;
}
</style>
  