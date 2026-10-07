import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vitest/config";

export default defineConfig({
    plugins: [vue()],
    define: {__DEMO__: false},
    test: {environment: "jsdom", include: ["tests/**/*.test.js"], testTimeout: 10000},
});
