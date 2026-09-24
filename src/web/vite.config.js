import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  build: { rollupOptions: { input: { main: "index.html", share: "share.html" } } },
  server: { proxy: { "/api": "http://127.0.0.1:8430" } },
});
