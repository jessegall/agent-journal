import vue from "@vitejs/plugin-vue";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {defineConfig} from "vite";

const BUILT_IN = "virtual:built-in-manifest";
const builtInManifest = () => ({
    name: "built-in-manifest",
    resolveId: (id) => (id === BUILT_IN ? `\0${BUILT_IN}` : undefined),
    load(id) {
        if (id !== `\0${BUILT_IN}`) return undefined;
        const dump = "import json, features; from surfaces.manifest import built_in; features.discover(); print(json.dumps(built_in()))";
        const json = execFileSync("python3", ["-c", dump], {cwd: fileURLToPath(new URL("..", import.meta.url)), env: {...process.env, PYTHONPATH: "."}, timeout: 30000});
        return `export default ${json.toString().trim()};`;
    },
});

export default defineConfig(({mode}) => {
    const demo = mode === "demo";
    return {
        plugins: [vue(), builtInManifest()],
        base: "./",
        define: {__DEMO__: demo, __DEMO_BUILD__: JSON.stringify(String(Date.now()))},
        build: demo
            ? {outDir: "dist-demo", rollupOptions: {input: {main: "index.html", phone: "phone.html"}}}
            : {rollupOptions: {input: {main: "index.html", share: "share.html", phone: "phone.html"}}},
        server: {proxy: {"/api": "http://127.0.0.1:8430"}},
    };
});
