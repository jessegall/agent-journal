import assert from "node:assert/strict";
import {existsSync, readFileSync, readdirSync, writeFileSync} from "node:fs";
import {homedir} from "node:os";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {build} from "esbuild";
import {chromium} from "playwright-core";

const viewerFolder = fileURLToPath(new URL("..", import.meta.url));
const POLL_MS = 2000;
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const isCommand = (request) => /\/api\/lines?$/.test(new URL(request.url()).pathname);

async function until(page, predicate, argument) {
    const deadline_at = Date.now() + 10000;
    while (!(await page.evaluate(predicate, argument))) {
        assert.ok(Date.now() < deadline_at, `the controlled viewer never reached ${predicate}`);
        await pause(25);
    }
}

function chromiumPath() {
    if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
    const cache = join(homedir(), "Library/Caches/ms-playwright");
    const folders = existsSync(cache) ? readdirSync(cache).filter((name) => name.startsWith("chromium_headless_shell-")).sort().reverse() : [];
    return folders.map((folder) => join(cache, folder, "chrome-headless-shell-mac-arm64/chrome-headless-shell")).find(existsSync)
        ?? (existsSync(chromium.executablePath()) ? chromium.executablePath() : undefined);
}

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
    await context.request.get(address);
    await page.route("**/read-counts-fixture", (route) => route.fulfill({contentType: "text/html", body: `
        <!doctype html><html><head><script type="importmap">{"imports":{
        "vue":"/viewer/vendor/vue-3.5.esm-browser.prod.js","@journal/window-kit":"/viewer/kit/window-kit.js"}}
        </script></head><body><div id="fixture"></div></body></html>`}));
    await page.goto(new URL("/read-counts-fixture", address).href);
    await page.addScriptTag({type: "module", content: code});
    await page.waitForFunction(() => Boolean(globalThis.readFixture));
    await page.evaluate(() => readFixture.transport.isRead(["message", "feed"]));
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await page.evaluate(({hidden, pollMilliseconds}) => {
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
            fixture.usePoll(fixture.load, () => true, pollMilliseconds);
            return () => fixture.h("div", "Controlled viewer reads");
        }});
        fixture.app.mount("#fixture");
    }, {hidden: initiallyHidden, pollMilliseconds: POLL_MS});
    await page.clock.runFor(100);
    await until(page, () => readFixture.results.length === 1);
    return page;
}

async function advancePoll(page) {
    const previous = await page.evaluate(() => readFixture.results.length);
    await page.clock.fastForward(POLL_MS);
    const hidden = await page.evaluate(() => readFixture.hidden);
    if (!hidden) await until(page, (before) => readFixture.results.length > before, previous);
}

async function funnelEvidence(page, baseline = null) {
    const evidence = await page.evaluate(async () => {
        const transport = globalThis[Symbol.for("journal.transport")];
        await transport.flushReadReceipts();
        return {client_id: transport.clientId, counts: transport.requestTotals(), receiptFailures: transport.receiptFailures,
            windows: Object.fromEntries([...transport.lineCounts.keys()].map((window) => [window, transport.requestCounts(window)]))};
    });
    if (!baseline) return evidence;
    return {...evidence, counts: Object.fromEntries(Object.entries(evidence.counts).map(([key, count]) => [key, count - baseline.counts[key]])),
        receiptFailures: evidence.receiptFailures - baseline.receiptFailures, opened_at: baseline.opened_at,
        closed_at: new Date().toISOString(), start_status: baseline.start_status};
}

async function visibilityCase(context, address, code, caseName, workload) {
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
    for (let step = 0; step < workload.hidden_seconds * 1000 / POLL_MS; step++) await advancePoll(page);
    const during = await page.evaluate(() => readFixture.transport.sentCounts("messages.chat"));
    await page.evaluate(() => readFixture.subscriptions.dispatch({event: "message.changed", environment: "main"}));
    const held = await page.evaluate(() => readFixture.subscriptions.held.size);
    if (caseName === "hidden-pane") assert.equal(held, 1);
    if (["hidden-tab", "initially-hidden"].includes(caseName)) {
        assert.deepEqual(during, before);
    }
    await page.evaluate(() => {
        readFixture.visible = true;
        readFixture.hidden = false;
        readFixture.subscriptions.shown("messages.chat");
        document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.clock.runFor(200);
    await until(page, () => readFixture.results.at(-1).ok);
    await page.evaluate(() => readFixture.app.unmount());
    await page.clock.resume();
    await until(page, () => readFixture.transport.joinedReads.size === 0);
    const after = await page.evaluate(() => ({counts: readFixture.transport.sentCounts("messages.chat"),
        eventCalls: readFixture.eventCalls, successfulReturn: readFixture.results.at(-1).ok}));
    const funnel = await funnelEvidence(page);
    await page.close();
    return {before, during, held, after, funnel, hidden_ms: workload.hidden_seconds * 1000, clock: "browser virtual timers"};
}

async function raceCase(context, address, code) {
    const page = await controlledPage(context, address, code, false);
    await page.evaluate(() => readFixture.app.unmount());
    await page.evaluate(() => readFixture.transport.flushReadReceipts());
    await page.clock.resume();
    let release;
    const held = new Promise((resolve) => { release = resolve; });
    let intercepted;
    const seen = new Promise((resolve) => { intercepted = resolve; });
    await page.route(/\/api\/lines?$/, async (route) => {
        if (route.request().postDataJSON().line?.[1] !== "feed") return route.continue();
        const response = await route.fetch();
        intercepted();
        await held;
        await route.fulfill({response});
    }, {times: 1});
    const before = await page.evaluate(() => readFixture.transport.sentCounts("messages.chat"));
    await page.evaluate(() => {
        readFixture.first = readFixture.lineResult("messages.chat", "message feed --limit 5", "main", undefined, true);
    });
    await pause(100);
    await seen;
    await page.evaluate(() => {
        readFixture.joined = readFixture.lineResult("messages.chat", "message feed --limit 5", "main", undefined, true);
    });
    const written = await page.evaluate(() => readFixture.lineResult("messages.chat", ["message", "send", "Action during a held read"], "main"));
    assert.equal(written.ok, true);
    await page.evaluate(() => {
        readFixture.transport.readsOutdated();
        readFixture.trailing = readFixture.lineResult("messages.chat", "message feed --limit 5", "main", undefined, true);
    });
    release();
    await pause(200);
    const answers = await page.evaluate(() => Promise.all([readFixture.first, readFixture.joined, readFixture.trailing]));
    assert.deepEqual(answers[0], answers[1]);
    assert.ok(answers[2].value.rows.some((row) => row.text === "Action during a held read"));
    const after = await page.evaluate(() => readFixture.transport.sentCounts("messages.chat"));
    assert.equal(after["message feed"] - before["message feed"], 2);
    assert.equal(after["message send"] - (before["message send"] ?? 0), 1);
    const funnel = await funnelEvidence(page);
    await page.close();
    return {before, after, joinedAnswerEqual: true, trailingContainsAction: true, funnel};
}

async function scheduleCase(context, address, workload, code) {
    const page = await context.newPage();
    await page.goto(address);
    await page.locator(".composer-input").waitFor();
    await page.locator("[data-message]").first().waitFor();
    await page.addScriptTag({type: "module", content: code});
    await page.waitForFunction(() => Boolean(globalThis.readFixture));
    await page.locator(".dock-stack .chat-dock").nth(workload.docks.length - 1).waitFor();
    assert.equal(await page.locator(".dock-stack .chat-dock").count(), workload.docks.length);
    const rows = await page.locator("[data-message]").count();
    assert.equal(rows, workload.displayed_rows);
    await until(page, () => globalThis[Symbol.for("journal.transport")].joinedReads.size === 0);
    const baseline = await funnelEvidence(page);
    baseline.opened_at = new Date().toISOString();
    baseline.start_status = await (await page.request.get(new URL("/api/request-log-status", address).href)).json();
    const snapshot = () => page.evaluate(() => {
        const transport = globalThis[Symbol.for("journal.transport")];
        return Object.fromEntries([...transport.lineCounts.keys()].map((window) => [window, transport.sentCounts(window)]));
    });
    const before = await snapshot();
    const startedAt = Date.now();
    for (const event of workload.events) {
        await pause(Math.max(0, startedAt + event.at_seconds * 1000 - Date.now()));
        const answer = await page.evaluate((event) => readFixture.lineResult("messages.chat", event.line, event.environment), event);
        assert.equal(answer.ok, true, JSON.stringify(answer));
    }
    await pause(Math.max(0, startedAt + workload.visible_seconds * 1000 - Date.now()));
    assert.equal(await page.locator("[data-message]").count(), workload.displayed_rows);
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
    await until(page, () => globalThis[Symbol.for("journal.transport")].joinedReads.size === 0);
    const funnel = await funnelEvidence(page, baseline);
    await page.close();
    return {before, visible, hidden, returned, funnel, scheduleClock: "wall", elapsedMs: Date.now() - startedAt};
}

export async function runViewerReadWorkload(address, workload, caseName = "schedule") {
    assert.equal(workload.identifier, "viewer-post-funnel-v1");
    const browser = await chromium.launch({executablePath: chromiumPath(), headless: true});
    const records = [];
    try {
        const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
        context.on("response", async (response) => {
            if (!isCommand(response.request())) return;
            records.push({url: response.url(), body: response.request().postDataJSON(), status: response.status(),
                request_id: response.headers()["x-journal-request-id"] ?? null});
        });
        const result = caseName === "schedule" ? await scheduleCase(context, address, workload, await fixtureCode())
            : caseName === "action-event-race" ? await raceCase(context, address, await fixtureCode())
                : await visibilityCase(context, address, await fixtureCode(), caseName, workload);
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
