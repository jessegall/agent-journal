import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vitest/config";

export default defineConfig({
    plugins: [vue()],
    define: {__DEMO__: false, __DEMO_BUILD__: JSON.stringify("test")},
    test: {environment: "jsdom", include: ["tests/**/*.test.js"], testTimeout: 10000, onUnhandledError: (error) => !String(error.message).includes("The test journal does not know this")},
});
