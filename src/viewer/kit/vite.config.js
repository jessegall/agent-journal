import vue from "@vitejs/plugin-vue";
import {copyFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {defineConfig} from "vite";
import {stylesInScripts} from "./build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));
const OUT_DIR = here("../../core/modules/viewer/web/dist/kit");

// the shell's colours and spacing beside the kit, for a frame window to link
const frameTokens = () => ({
    name: "frame-tokens",
    apply: "build",
    writeBundle() {
        copyFileSync(here("../src/tokens.css"), `${OUT_DIR}/tokens.css`);
    },
});

// the window kit built on its own, served at /viewer/kit/window-kit.js with Vue left to the page's import map, and
// the bridge a frame window loads at /viewer/kit/frame-bridge.js
export default defineConfig({
    plugins: [vue(), stylesInScripts(), frameTokens()],
    publicDir: false,
    build: {
        outDir: OUT_DIR,
        emptyOutDir: true,
        lib: {
            entry: {"window-kit": here("./index.js"), "frame-bridge": here("./frameBridgeClient.js")},
            formats: ["es"],
            fileName: (_, name) => `${name}.js`,
            cssFileName: "window-kit",
        },
        rollupOptions: {external: ["vue"]},
    },
});
