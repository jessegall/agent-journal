import vue from "@vitejs/plugin-vue";
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {defineConfig} from "vite";
import {LESSONS} from "./demo/lessons.js";
import {expand} from "./demo/moments.js";
import {lessonFacts} from "./demo/pacing.js";

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

const FACTS = "virtual:lesson-facts";
const lessonLengths = () => ({
    name: "lesson-facts",
    resolveId: (id) => (id === FACTS ? `\0${FACTS}` : undefined),
    load(id) {
        if (id !== `\0${FACTS}`) return undefined;
        const facts = Object.fromEntries(
            LESSONS.map(({key, subjects}) => {
                const recorded = JSON.parse(readFileSync(new URL(`./demo/scenarios/${key}.json`, import.meta.url)));
                return [key, lessonFacts(expand(recorded).moments, subjects)];
            })
        );
        return `export default ${JSON.stringify(facts)};`;
    },
});

export default defineConfig(({mode}) => {
    const demo = mode === "demo";
    return {
        plugins: [vue(), builtInManifest(), lessonLengths()],
        base: "./",
        define: {__DEMO__: demo, __DEMO_BUILD__: JSON.stringify(String(Date.now()))},
        build: demo
            ? {outDir: "dist-demo", rollupOptions: {input: {main: "index.html", phone: "phone.html"}}}
            : {rollupOptions: {input: {main: "index.html", share: "share.html", phone: "phone.html"}}},
        server: {proxy: {"/api": "http://127.0.0.1:8430"}},
    };
});
