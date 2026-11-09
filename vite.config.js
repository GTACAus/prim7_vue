import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [
    vueDevTools(),
    vue({
      template: {
        transformAssetUrls: { tags: {} },
        compilerOptions: { whitespace: "preserve" },
      },
    }),
  ],
  devtools: {
    apply: "serve",
  },
});
