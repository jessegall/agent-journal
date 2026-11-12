import vue from "@vitejs/plugin-vue";
import {fileURLToPath} from "node:url";
import {defineConfig} from "vitest/config";

export default defineConfig({
    plugins: [vue()],
    resolve: {alias: {"@journal/window-kit": fileURLToPath(new URL("./kit/index.js", import.meta.url)), "@journal/setting-components": fileURLToPath(new URL("../core/modules/setting_components/web/src/index.js", import.meta.url))}, dedupe: ["vue"]},
    // the avatar's tests run only when asked with FIGURE_TESTS=1; what a passing test logs is left out
    test: {environment: "jsdom", setupFiles: ["./tests/support/resizeObserver.js"], include: ["tests/**/*.test.js"], exclude: process.env.FIGURE_TESTS ? [] : ["tests/figure*.test.js", "tests/*VoiceFigure*.test.js", "tests/headTilt.test.js"], silent: "passed-only", testTimeout: 30000},
});
