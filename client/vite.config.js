import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue2";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  define: {
    SERVER_ADDR: JSON.stringify(
      "https://post-application-f823a2a81cb3.herokuapp.com/"
    ),
    POSTS_PER_PAGE: 4,
  },
});
