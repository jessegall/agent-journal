import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
import vue from "@vitejs/plugin-vue";
import {createServer} from "vite";
import {chromium} from "playwright-core";

const entry = `
import {createApp, h} from 'vue';
import Inspector from '/src/resource/ProcessQueueBody.vue';
let queue = {
    environment_name: 'main', parallel_limit: 2, used_slots: 0, waiting_count: 0,
    running: [], waiting: [], recent: [],
};
window.updateQueue = (value) => { queue = {...queue, ...value}; };
const app = createApp({render: () => h(Inspector, {read: async () => ({ok: true, value: queue})})});
app.mount('#app');
`;
const server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL("..", import.meta.url)),
    resolve: {alias: {"@journal/window-kit": fileURLToPath(new URL("../kit/index.js", import.meta.url))}},
    plugins: [vue(), {
        name: "queue-motion-test",
        resolveId: (id) => id === "/queue-motion.js" ? id : null,
        load: (id) => id === "/queue-motion.js" ? entry : null,
        configureServer(server) {
            server.middlewares.use((request, response, next) => {
                if (request.url !== "/") return next();
                response.setHeader("Content-Type", "text/html");
                response.end('<div id="app" style="width:660px;height:900px"></div><script type="module" src="/queue-motion.js"></script>');
            });
        },
    }],
    server: {host: "127.0.0.1", port: 0},
});
await server.listen();
const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 1100}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
        window.queueTransitions = [];
        new MutationObserver((changes) => {
            for (const change of changes) {
                const element = change.target;
                if (element.matches?.("[data-test-queue], [data-queue-process]")) {
                    window.queueTransitions.push({id: element.dataset.queueProcess, classes: element.className});
                }
            }
        }).observe(document, {subtree: true, attributes: true, attributeFilter: ["class"]});
    });
    await page.goto(server.resolvedUrls.local[0]);
    await page.locator("[data-queue-controls]").waitFor();
    await page.waitForFunction(() => window.queueTransitions.some((item) => item.classes.includes("queue-enter-active")));
    const run = (id, section) => ({id, section, state: section === "recent" ? "finished" : section, line: `Command ${id}`, category: "check", created_at: "2026-11-03T10:00:00Z"});
    const update = async (value) => {
        await page.evaluate((queue) => window.updateQueue(queue), value);
        await page.getByRole("button", {name: "More runs at once"}).click();
    };
    const settled = () => page.waitForFunction(() => !document.querySelector('[class*="queue-run-enter-"], [class*="queue-run-leave-"], .queue-run-move'));
    await update({waiting: [run(1, "waiting"), run(2, "waiting")]});
    await page.waitForFunction(() => window.queueTransitions.some((item) => item.id === "1" && item.classes.includes("queue-run-enter-active")));
    await settled();
    await update({waiting: [run(2, "waiting"), run(1, "waiting")]});
    await page.waitForFunction(() => document.querySelector('[data-queue-process="1"]').classList.contains("queue-run-move"));
    assert.notEqual(await page.locator('[data-queue-process="1"]').evaluate((row) => getComputedStyle(row).transitionDuration), "0s");
    await page.screenshot({path: "/tmp/journal-worker-473-queue-motion.png"});
    await settled();
    await update({waiting: [run(2, "waiting")], running: [run(1, "running")]});
    await page.waitForFunction(() => document.querySelector('.running.queue-run-enter-active') && document.querySelector('.waiting.queue-run-leave-active'));
    await settled();
    await update({running: [], recent: [run(1, "recent")]});
    await page.waitForFunction(() => document.querySelector('.recent.queue-run-enter-active') && document.querySelector('.running.queue-run-leave-active'));
    await settled();
    await update({waiting: [], recent: []});
    await page.waitForFunction(() => document.querySelectorAll('.queue-run-leave-active').length === 2);
    await settled();
    assert.equal(await page.locator("[data-queue-process]").count(), 0);
    await page.emulateMedia({reducedMotion: "reduce"});
    await update({waiting: [run(3, "waiting"), run(4, "waiting")]});
    await settled();
    assert.equal(await page.locator('[data-queue-process="3"]').evaluate((row) => {
        row.classList.add("queue-run-move", "queue-run-enter-active", "queue-run-enter-from");
        return getComputedStyle(row).transitionDuration;
    }), "0s");
    assert.equal(await page.locator('[data-queue-process="3"]').evaluate((row) => getComputedStyle(row).transform), "none");
    assert.equal(await page.locator("[data-test-queue]").evaluate((queue) => {
        queue.classList.add("queue-enter-active");
        return getComputedStyle(queue).transitionDuration;
    }), "0s");
    assert.deepEqual(errors, []);
    console.log("Queue appearance, insertion, reordering, both section moves, removal and reduced motion passed in headless Chromium.");
} finally {
    await browser.close();
    await server.close();
}
