import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vite";

export default defineConfig({
    plugins: [vue()],
    base: "/viewer/",
    define: {__DEMO__: false, __DEMO_BUILD__: JSON.stringify("")},
    build: {outDir: "../core/modules/viewer/web/dist", emptyOutDir: true},
});
