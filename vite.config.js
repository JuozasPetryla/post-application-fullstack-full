import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue2";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  define: {
    SERVER_ADDR: JSON.stringify("https://post-application.onrender.com"),
    POSTS_PER_PAGE: 4,
  },
});
