import assert from "node:assert/strict";
import {readFileSync, writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {build} from "esbuild";
import {chromium} from "playwright-core";

const viewerFolder = fileURLToPath(new URL("..", import.meta.url));
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const isCommand = (request) => /\/api\/lines?$/.test(new URL(request.url()).pathname);

async function fixtureCode() {
    const bundled = await build({
        stdin: {contents: `
            import {createApp, h} from "vue";
            import {windowContext, lineResult} from "./src/windows/windowContext.js";
            import {WindowSubscriptions} from "./src/windows/windowSubscriptions.js";
            import {transport} from "./src/api/transport.js";
            import {usePoll} from "./kit/usePoll.js";
            globalThis.readFixture = {createApp, h, windowContext, lineResult, WindowSubscriptions, transport, usePoll};
        `, resolveDir: viewerFolder},
        bundle: true, write: false, format: "esm", external: ["vue", "@journal/window-kit"],
    });
    return bundled.outputFiles[0].text;
}

async function controlledPage(context, address, code, initiallyHidden) {
    const page = await context.newPage();
    await page.goto(address);
    await page.locator(".composer-input").waitFor();
    await page.route("**/read-counts-fixture", (route) => route.fulfill({contentType: "text/html", body: `
        <!doctype html><html><head><script type="importmap">{"imports":{
        "vue":"/viewer/vendor/vue-3.5.esm-browser.prod.js","@journal/window-kit":"/viewer/kit/window-kit.js"}}
        </script></head><body><div id="fixture"></div></body></html>`}));
    await page.goto(new URL("/read-counts-fixture", address).href);
    await page.addScriptTag({type: "module", content: code});
    await page.waitForFunction(() => Boolean(globalThis.readFixture));
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await page.evaluate((hidden) => {
        const fixture = globalThis.readFixture;
        fixture.hidden = hidden;
        fixture.visible = true;
        fixture.results = [];
        fixture.eventCalls = 0;
        Object.defineProperty(document, "hidden", {configurable: true, get: () => fixture.hidden});
        fixture.subscriptions = new fixture.WindowSubscriptions();
        fixture.window = fixture.windowContext({window: "messages.chat", environment: "main", agent: 1,
            visible: () => fixture.visible, permissions: {}, events: ["message.*"], subscriptions: fixture.subscriptions});
        fixture.load = async () => {
            const answer = await fixture.window.read("message feed --limit 5", {unbatched: true});
            fixture.results.push(answer);
            return answer;
        };
        fixture.window.follow(["message.*"], () => { fixture.eventCalls += 1; fixture.load(); });
        fixture.app = fixture.createApp({setup() {
            fixture.usePoll(fixture.load, () => true, 2000);
            return () => fixture.h("div", "Controlled viewer reads");
        }});
        fixture.app.mount("#fixture");
    }, initiallyHidden);
    await page.clock.runFor(100);
    await page.waitForFunction(() => readFixture.results.length === 1);
    return page;
}

async function advancePoll(page) {
    const previous = await page.evaluate(() => readFixture.results.length);
    await page.clock.runFor(2100);
    const hidden = await page.evaluate(() => readFixture.hidden);
    if (!hidden) await page.waitForFunction((before) => readFixture.results.length > before, previous);
}

async function visibilityCase(context, address, code, caseName) {
    const page = await controlledPage(context, address, code, caseName === "initially-hidden");
    const before = await page.evaluate(() => readFixture.transport.sentCounts("messages.chat"));
    if (caseName === "hidden-pane") await page.evaluate(() => { readFixture.visible = false; });
    if (caseName === "hidden-tab") await page.evaluate(() => {
        readFixture.hidden = true;
        document.dispatchEvent(new Event("visibilitychange"));
    });
    if (caseName === "failure-return") {
        await page.route(/\/api\/lines?$/, (route) => route.fulfill({status: 500, body: "Controlled failure"}));
        await advancePoll(page);
        assert.equal(await page.evaluate(() => readFixture.results.at(-1).ok), false);
        await page.unroute(/\/api\/lines?$/);
    }
    for (let step = 0; step < 15; step++) await advancePoll(page);
    await page.evaluate(() => readFixture.subscriptions.dispatch({event: "message.changed", environment: "main"}));
    const held = await page.evaluate(() => readFixture.subscriptions.held.size);
    const during = await page.evaluate(() => readFixture.transport.sentCounts("messages.chat"));
    if (caseName === "hidden-pane") assert.equal(held, 1);
    if (["hidden-tab", "initially-hidden"].includes(caseName)) {
        // usePoll currently performs its initial load even when the tab starts hidden.
        // The event subscription has separate pane visibility; it is not a timer poll.
        assert.deepEqual(during, before);
    }
    await page.evaluate(() => {
        readFixture.visible = true;
        readFixture.hidden = false;
        readFixture.subscriptions.shown("messages.chat");
        document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.clock.runFor(200);
    await page.waitForFunction(() => readFixture.results.at(-1).ok);
    const result = await page.evaluate(() => ({before, results: readFixture.results.length})).catch(() => null);
    const after = await page.evaluate(() => ({counts: readFixture.transport.sentCounts("messages.chat"),
        eventCalls: readFixture.eventCalls, successfulReturn: readFixture.results.at(-1).ok}));
    await page.close();
    return {before, during, held, after};
}

async function scheduleCase(context, address, workload) {
    const page = await context.newPage();
    await page.goto(address);
    await page.locator(".composer-input").waitFor();
    await page.locator("[data-message]").first().waitFor();
    assert.equal(await page.locator(".dock-title").count(), workload.docks.length);
    const rows = await page.locator("[data-message]").count();
    assert.equal(rows, workload.displayed_rows);
    const snapshot = () => page.evaluate(() => {
        const transport = globalThis[Symbol.for("journal.transport")];
        return Object.fromEntries([...transport.lineCounts.keys()].map((window) => [window, transport.sentCounts(window)]));
    });
    const before = await snapshot();
    const startedAt = Date.now();
    for (const event of workload.events) {
        await pause(Math.max(0, startedAt + event.at_seconds * 1000 - Date.now()));
        const answer = await page.evaluate(async (event) => {
            const transport = globalThis[Symbol.for("journal.transport")];
            const body = {window: "messages.chat", environment: event.environment, line: event.line};
            const response = await transport.raw("/api/line", {method: "POST", headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)}, {window: body.window, line: body.line.join(" ")});
            return response.json();
        }, event);
        assert.equal(answer.code, 0, JSON.stringify(answer));
    }
    await pause(Math.max(0, startedAt + workload.visible_seconds * 1000 - Date.now()));
    const visible = await snapshot();
    await page.evaluate(() => {
        Object.defineProperty(document, "hidden", {configurable: true, get: () => true});
        document.dispatchEvent(new Event("visibilitychange"));
    });
    await pause(workload.hidden_seconds * 1000);
    const hidden = await snapshot();
    await page.evaluate(() => {
        Object.defineProperty(document, "hidden", {configurable: true, get: () => false});
        document.dispatchEvent(new Event("visibilitychange"));
    });
    await pause(1000);
    const returned = await snapshot();
    await page.close();
    return {before, visible, hidden, returned, scheduleClock: "wall", elapsedMs: Date.now() - startedAt};
}

export async function runViewerReadWorkload(address, workload, caseName = "schedule") {
    assert.equal(workload.identifier, "viewer-post-funnel-v1");
    const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
    const records = [];
    try {
        const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
        context.on("response", async (response) => {
            if (!isCommand(response.request())) return;
            records.push({url: response.url(), body: response.request().postDataJSON(), status: response.status(),
                request_id: response.headers()["x-journal-request-id"] ?? null});
        });
        const result = caseName === "schedule" ? await scheduleCase(context, address, workload)
            : await visibilityCase(context, address, await fixtureCode(), caseName);
        return {workload, caseName, result, network: records};
    } finally {
        await browser.close();
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [address, manifestFile, resultFile, caseName = "schedule"] = process.argv.slice(2);
    const result = await runViewerReadWorkload(address, JSON.parse(readFileSync(manifestFile, "utf8")), caseName);
    writeFileSync(resultFile, JSON.stringify(result));
}
