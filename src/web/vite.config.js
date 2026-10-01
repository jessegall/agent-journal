import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vite";

export default defineConfig(({mode}) => {
    const demo = mode === "demo";
    return {
        plugins: [vue()],
        base: "./",
        define: {__DEMO__: demo, __DEMO_BUILD__: JSON.stringify(String(Date.now()))},
        build: demo
            ? {outDir: "dist-demo", rollupOptions: {input: {main: "index.html"}}}
            : {rollupOptions: {input: {main: "index.html", share: "share.html", phone: "phone.html"}}},
        server: {proxy: {"/api": "http://127.0.0.1:8430"}},
    };
});
