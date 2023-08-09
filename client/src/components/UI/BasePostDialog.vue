<template>
  <div class="overlay">
    <dialog open>
      <header>
        <slot name="header"></slot>
      </header>

      <form @submit.prevent="formSubmit">
        <div class="form-control">
          <label for="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            v-model="title"
            :class="{ invalid: !titleIsValid }"
            @blur="validateTitle"
            @input="validateTitle"
          />
          <p v-if="!titleIsValid">Please enter a title</p>
        </div>
        <div class="form-control" v-if="formMode === 'create'">
          <label for="author">Author:</label>
          <select
            name="author"
            id="author"
            v-model="authorObj"
            :class="{ invalid: !authorIsValid }"
            @focusout="validateAuthor"
            size="4"
          >
            <option
              class="select-options"
              v-for="author in authorsWithPosts"
              :key="author.id"
              :value="{
                name: author.name,
                surname: author.surname,
                id: author.id,
              }"
            >
              {{ author.name + " " + author.surname }}
            </option>
          </select>
          <p v-if="!authorIsValid">Please select an author</p>
        </div>
        <div class="form-control">
          <label for="content">Content:</label>
          <textarea
            name="content"
            id="content"
            rows="5"
            v-model="content"
            :class="{ invalid: !contentIsValid }"
            @blur="validateContent"
          ></textarea>
          <p v-if="!contentIsValid">Content must be atleast 10 characters</p>
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
      title: "",
      content: "",
      authorObj: {},
      titleIsValid: true,
      authorIsValid: true,
      contentIsValid: true,
      formIsValid: false,
    };
  },
  computed: {
    ...mapGetters(["authors", "authorsWithPosts", "formMode", "editId"]),
  },
  methods: {
    ...mapActions([
      "closeModal",
      "createNewPost",
      "editPost",
      "getPostsWithAuthors",
      "getAuthorsWithPosts",
    ]),
    formSubmit() {
      if (!this.formIsValid) return;
      if (this.formMode === "create") {
        this.createNewPost({
          title: this.title,
          body: this.content,
          author_id: this.authorObj.id,
          created_at: new Date().toLocaleString(),
          updated_at: new Date().toLocaleString(),
        });
      }
      if (this.formMode === "edit") {
        this.editPost({
          title: this.title,
          body: this.content,
          id: this.editId,
          updated_at: new Date().toISOString().slice(0, 10),
        });
      }
      this.closeModal();
      if (this.$router.currentRoute.path !== "/") {
        this.$router.push("/");
      }
      this.getPostsWithAuthors();
    },
    validateCreateForm() {
      this.validateTitle();
      this.validateAuthor();
      this.validateContent();
      if (this.titleIsValid && this.authorIsValid && this.contentIsValid) {
        this.formIsValid = true;
      } else {
        this.formIsValid = false;
      }
    },
    validateEditForm() {
      this.validateTitle();
      this.validateContent();
      if (this.titleIsValid && this.contentIsValid) {
        this.formIsValid = true;
      } else {
        this.formIsValid = false;
      }
    },
    validateTitle() {
      if (this.title) {
        this.titleIsValid = true;
      } else {
        this.titleIsValid = false;
      }
    },
    validateAuthor() {
      if (this.authorObj.name) {
        this.authorIsValid = true;
      } else {
        this.authorIsValid = false;
      }
    },
    validateContent() {
      if (this.content.length > 10) {
        this.contentIsValid = true;
      } else {
        this.contentIsValid = false;
      }
    },
  },
  created() {
    this.getAuthorsWithPosts();
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
  align-items: center;
  position: absolute;
  top: 25%;
  width: 27.5rem;
  height: 25rem;
  z-index: 1;
  padding: 0;
  border: none;
  gap: 2.4rem;
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
