import vue from "@vitejs/plugin-vue";
import {fileURLToPath} from "node:url";
import {defineConfig} from "vite";

// the window kit built on its own, served at /viewer/kit/window-kit.js, with Vue left to the page's import map
export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: fileURLToPath(new URL("../../core/modules/viewer/web/dist/kit", import.meta.url)),
        emptyOutDir: true,
        lib: {entry: fileURLToPath(new URL("./index.js", import.meta.url)), formats: ["es"], fileName: () => "window-kit.js", cssFileName: "window-kit"},
        rollupOptions: {external: ["vue"]},
    },
});
