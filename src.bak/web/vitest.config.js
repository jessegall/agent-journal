import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vitest/config";

export default defineConfig({
    plugins: [vue()],
    define: {__DEMO__: false, __DEMO_BUILD__: JSON.stringify("test")},
    test: {environment: "jsdom", pool: "vmThreads", include: ["tests/**/*.test.js"], testTimeout: 10000, maxWorkers: 3},
});
