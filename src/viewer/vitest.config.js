import vue from "@vitejs/plugin-vue";
import {fileURLToPath} from "node:url";
import {defineConfig} from "vitest/config";

export default defineConfig({
    plugins: [vue()],
    resolve: {alias: {"@journal/window-kit": fileURLToPath(new URL("./kit/index.js", import.meta.url))}},
    test: {environment: "jsdom", include: ["tests/**/*.test.js"], testTimeout: 30000},
});
