import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vite";

// the build a module's page windows use: one file per entry, with Vue and the window kit left to the page's import map,
// so every window shares the page's one Vue
export function windowBuild({entries, outDir = "web/dist"}) {
    return defineConfig({
        plugins: [vue()],
        build: {
            outDir,
            emptyOutDir: false,
            lib: {entry: entries, formats: ["es"], fileName: (_, name) => `${name}.js`, cssFileName: "windows"},
            rollupOptions: {external: ["vue", "@journal/window-kit"]},
        },
    });
}
