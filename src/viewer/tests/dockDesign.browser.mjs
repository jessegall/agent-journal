import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";
import vue from "@vitejs/plugin-vue";
import {chromium} from "playwright-core";

const root = fileURLToPath(new URL("../", import.meta.url));
const project = fileURLToPath(new URL("../../../", import.meta.url)).replace(/\/$/, "");
const server = await createServer({configFile: false, root, plugins: [vue()], resolve: {alias: {"@journal/window-kit": `${root}kit/index.js`}, dedupe: ["vue"]}, define: {__PROJECT_ROOT__: JSON.stringify(project), __DEMO__: false}, server: {host: "127.0.0.1", port: 0, fs: {allow: [project]}}});
await server.listen();
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 1800}, reducedMotion: "reduce"});
    page.setDefaultTimeout(15000);
    page.on("pageerror", error => console.error(error.message));
    const requests = [];
    const row = line => {
        requests.push(line);
        const id = Number(line[2]);
        if (line[0] === "plan" && line[1] === "outline") return {agents: [{id: 1, name: "Ada"}], phases: Array.from({length: 7}, (_, i) => ({id: i + 1, title: `Phase ${i + 1}`, tasks: [{id: 1}]}))};
        if (line[0] === "plan" && line[1] === "progress") return {task_count: 12, completed_count: id === 3 ? 0 : 7, current_phase: 2};
        if (line[0] === "process" && line[1] === "card") return {title: "Running tests", line: "python3 tests.py", state: "running", steps_passed: 12, progress: 40, created_at: new Date(Date.now() - 134000).toISOString()};
        if (line[0] === "output" && line[1] === "page") return {lines: ["Tests passed"], first_byte: 0, last_byte: 12, total: 12};
        if (line[0] === "question" && line[1] === "list") return {rows: [{id: 1}, {id: 2}, {id: 3}]};
        if (line[0] === "dump" && line[1] === "items") return [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
        return {id, state: id === 15 ? "running" : id === 5 ? "ready" : "started", title: "Example", text: "Keep changes small enough to review in one sitting.", weight: 3};
    };
    await page.route(url => url.pathname.startsWith("/api/"), async route => {
        if (route.request().url().includes("/api/buttons")) return route.fulfill({json: {missing: {}, buttons: ["Approve", "Ask for a critique"].map((label, i) => ({name: `plan.${i}`, slots: ["dock.plans.waiting"], label, runs: `plan ${i ? "critique" : "approve"} {row_id}`, primary: !i, fields: [], menu: [], condition: {field: "state", values: ["ready"]}}))}});
        if (route.request().method() === "GET") return route.fulfill({json: {}});
        const payload = route.request().postDataJSON();
        const answer = request => ({code: 0, value: row(request.line), error: ""});
        await route.fulfill({json: payload.lines ? {answers: payload.lines.map(answer)} : answer(payload)});
    });
    await page.goto(`${server.resolvedUrls.local[0]}tests/dockDesign.html`, {waitUntil: "domcontentloaded", timeout: 15000});
    await page.locator('[data-output-steps]').waitFor().catch(async error => { console.error(await page.locator('body').innerText()); console.error(JSON.stringify(requests)); throw error; });
    await page.getByText("Tasks:", {exact: false}).first().waitFor();
    await page.waitForFunction(() => !document.querySelector('.plan-dock-loading'));
    const cards = page.locator(".chat-dock-card");
    assert.equal(await cards.count(), 15);
    for (const card of await cards.all()) {
        assert.equal(await card.locator(".chat-dock-head").count(), 1);
        assert.equal(await card.locator(".chat-dock-foot").count(), 1);
        assert.equal((await card.locator(".chat-dock-foot button").last().innerText()).trim(), "Close");
        assert.equal(await card.locator(".chat-dock-head button:not(.icon)").count(), 0);
    }
    const doc = cards.nth(0), waiting = cards.nth(4), run = cards.nth(14);
    assert.equal(await doc.locator(".chat-dock-foot").innerText(), "Document\nOpen\nClose");
    assert.match(await cards.nth(2).locator(".dock-facts").innerText(), /Tasks: 12/);
    assert.match(await cards.nth(3).locator(".dock-facts").innerText(), /Tasks: 7 of 12/);
    assert.match(await cards.nth(9).locator(".dock-facts").innerText(), /Task: /);
    assert.match(await cards.nth(10).locator(".dock-facts").innerText(), /Memory.*Weight: 3/s);
    assert.match(await cards.nth(11).locator(".dock-facts").innerText(), /Question: /);
    assert.match(await cards.nth(12).locator(".dock-facts").innerText(), /Dump.*Items: 4/s);
    assert.match(await cards.nth(13).locator(".chat-dock-head").innerText(), /Agent asked 3 questions/);
    assert.match(await waiting.getAttribute("aria-label"), /waiting for you$/);
    assert.deepEqual(await waiting.locator(".chat-dock-foot button").allTextContents(), ["Phases", "Approve", "Ask for a critique", "Open", "Close"]);
    for (const width of [800, 492, 390, 340, 280]) {
        await page.locator("#cards").evaluate((el, width) => el.style.width = `${width}px`, width);
        const measurements = await cards.evaluateAll(cards => cards.map(card => ({width: card.clientWidth, scroll: card.scrollWidth, head: card.querySelector('.chat-dock-head').getBoundingClientRect().height, height: card.getBoundingClientRect().height})));
        assert.ok(measurements.every(m => m.scroll <= m.width + 1), JSON.stringify({width, measurements}));
        assert.ok(measurements.every(m => m.head === 28));
        assert.equal(measurements[0].height, 65);
        if (width === 390) assert.equal(measurements[4].height, 93);
    }
    const fold = run.locator("[data-dock-fold]");
    const before = await fold.boundingBox();
    await fold.click();
    await page.waitForFunction(() => document.querySelector('[data-output-terminal]')?.textContent.includes('Tests passed'));
    assert.equal(await fold.getAttribute("aria-expanded"), "true");
    assert.equal((await fold.boundingBox()).y, before.y);
    const stopped = page.waitForRequest(request => request.method() === "POST" && request.postDataJSON()?.line?.join(" ") === "output stop 15");
    await run.locator('[data-dock-action="declared"]').click();
    await stopped;
    await page.evaluate(() => window.dockDesign.items[14].kept = true);
    const pin = run.locator('[data-dock-action="unkeep"]');
    assert.equal(await pin.getAttribute("aria-pressed"), "true");
    assert.equal(await pin.getAttribute("title"), "Let this card close");
    assert.match(await run.locator('.dock-facts').innerText(), /Kept/);
    console.log("Dock design browser: 1 passed, 0 failed");
} finally { await browser.close(); await server.close(); }
