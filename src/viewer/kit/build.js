import vue from "@vitejs/plugin-vue";
import {createHash} from "node:crypto";
import {defineConfig} from "vite";

// the mark the code commandments judge reads to leave a built file alone
const GENERATED_MARK = "/* @code-commandments-generated */";
const FRAME_BRIDGE = "frame-bridge";

// a module's styles, put into each of its window scripts and added to the page once, since the page loads a window's
// script alone; every built file is marked as generated
export const stylesInScripts = () => ({
    name: "styles-in-scripts",
    apply: "build",
    enforce: "post",
    generateBundle(options, bundle) {
        const sheets = Object.values(bundle).filter((file) => file.type === "asset" && file.fileName.endsWith(".css"));
        const css = sheets.map((sheet) => sheet.source).join("\n");
        sheets.forEach((sheet) => delete bundle[sheet.fileName]);
        const id = `window-styles-${createHash("sha256").update(css).digest("hex").slice(0, 12)}`;
        const added = css ? `if (!document.getElementById(${JSON.stringify(id)})) { const style = document.createElement("style"); style.id = ${JSON.stringify(id)}; style.textContent = ${JSON.stringify(css)}; document.head.appendChild(style); }\n` : "";
        for (const file of Object.values(bundle)) {
            if (file.type === "chunk") file.code = `${GENERATED_MARK}\n${file.isEntry && file.name !== FRAME_BRIDGE ? added : ""}${file.code}`;
        }
    },
});

// the build a module's windows use: one file per entry; a page window leaves Vue and the window kit to the page's import
// map, so every window shares the page's one Vue, and a frame window, which has no import map, bundles everything but
// the bridge it loads from the shell
export function windowBuild({entries, outDir = "web/dist", frame = false}) {
    return defineConfig({
        plugins: [vue(), stylesInScripts()],
        publicDir: false,
        build: {
            outDir,
            emptyOutDir: false,
            lib: {entry: entries, formats: ["es"], fileName: (_, name) => `${name}.js`, cssFileName: "windows"},
            rollupOptions: {external: frame ? [/^\/viewer\/kit\//] : ["vue", "@journal/window-kit"]},
        },
    });
}
