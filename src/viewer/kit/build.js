import vue from "@vitejs/plugin-vue";
import {createHash} from "node:crypto";
import {defineConfig} from "vite";

// a module's styles, put into each of its window scripts and added to the page once, since the page loads a window's
// script alone
const stylesInScripts = () => ({
    name: "styles-in-scripts",
    apply: "build",
    enforce: "post",
    generateBundle(options, bundle) {
        const sheets = Object.values(bundle).filter((file) => file.type === "asset" && file.fileName.endsWith(".css"));
        const css = sheets.map((sheet) => sheet.source).join("\n");
        sheets.forEach((sheet) => delete bundle[sheet.fileName]);
        if (!css) return;
        const id = `window-styles-${createHash("sha256").update(css).digest("hex").slice(0, 12)}`;
        const added = `if (!document.getElementById(${JSON.stringify(id)})) { const style = document.createElement("style"); style.id = ${JSON.stringify(id)}; style.textContent = ${JSON.stringify(css)}; document.head.appendChild(style); }\n`;
        for (const file of Object.values(bundle)) {
            if (file.type === "chunk" && file.isEntry) file.code = added + file.code;
        }
    },
});

// the build a module's page windows use: one file per entry, with Vue and the window kit left to the page's import map,
// so every window shares the page's one Vue
export function windowBuild({entries, outDir = "web/dist"}) {
    return defineConfig({
        plugins: [vue(), stylesInScripts()],
        publicDir: false,
        build: {
            outDir,
            emptyOutDir: false,
            lib: {entry: entries, formats: ["es"], fileName: (_, name) => `${name}.js`, cssFileName: "windows"},
            rollupOptions: {external: ["vue", "@journal/window-kit"]},
        },
    });
}
