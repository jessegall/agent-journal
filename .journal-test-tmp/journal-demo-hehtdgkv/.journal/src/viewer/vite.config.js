import vue from "@vitejs/plugin-vue";
import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {defineConfig} from "vite";

const VUE_FILE = "vue-3.5.esm-browser.prod.js";
const OUT_DIR = fileURLToPath(new URL("../core/modules/viewer/web/dist", import.meta.url));

// the page's one Vue, copied beside the shell for the import map to load
const vendorVue = () => ({
    name: "vendor-vue",
    apply: "build",
    writeBundle() {
        mkdirSync(`${OUT_DIR}/vendor`, {recursive: true});
        copyFileSync(fileURLToPath(new URL("./node_modules/vue/dist/vue.esm-browser.prod.js", import.meta.url)), `${OUT_DIR}/vendor/${VUE_FILE}`);
    },
});

// the phone's service worker, written in tools/phone-worker and put beside the shell as a built file
const GENERATED_MARK = "/* @code-commandments-generated */";
const phoneWorker = () => ({
    name: "phone-worker",
    apply: "build",
    writeBundle() {
        const source = readFileSync(fileURLToPath(new URL("../../tools/phone-worker/phone-sw.js", import.meta.url)), "utf8");
        writeFileSync(`${OUT_DIR}/phone-sw.js`, `${GENERATED_MARK}\n${source}`);
    },
});

export default defineConfig({
    plugins: [vue(), vendorVue(), phoneWorker()],
    base: "/viewer/",
    define: {__DEMO__: false, __DEMO_BUILD__: JSON.stringify("")},
    build: {outDir: OUT_DIR, emptyOutDir: true, rollupOptions: {external: ["vue", "@journal/window-kit"]}},
});
