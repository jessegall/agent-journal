import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {writeFileSync} from "node:fs";
import {chromium} from "playwright-core";

const [address, numbersFile] = process.argv.slice(2);
const TABS = 7;
const TAB_WAIT_MS = 8000;
const EVENT_WAIT_MS = 10000;
const port = new URL(address).port;
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});

// the connections the browser holds open to the viewer, as the system counts them
function openConnections() {
    const listed = execFileSync("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:ESTABLISHED"], {encoding: "utf8"});
    return listed.split("\n").filter((row) => row.includes(`->127.0.0.1:${port}`)).length;
}

async function send(page, words) {
    await page.locator(".composer-input").fill(words);
    await page.locator(".composer-input").press("Enter");
}

const shows = (page, words) => page.locator("[data-message]", {hasText: words}).first().waitFor({timeout: EVENT_WAIT_MS});

try {
    const context = await browser.newContext({viewport: {width: 1280, height: 900}});
    let streams = 0;
    let mostStreams = 0;
    let mostBlockedMs = 0;
    const isStream = (request) => new URL(request.url()).pathname === "/api/events";
    context.on("request", (request) => {
        if (!isStream(request)) return;
        streams += 1;
        mostStreams = Math.max(mostStreams, streams);
    });
    context.on("requestfailed", (request) => isStream(request) && (streams -= 1));
    context.on("requestfinished", (request) => {
        if (isStream(request)) streams -= 1;
        else mostBlockedMs = Math.max(mostBlockedMs, request.timing().requestStart);
    });
    const pages = [];
    const tabMs = [];
    for (let tab = 0; tab < TABS; tab++) {
        const page = await context.newPage();
        const started = Date.now();
        pages.push(page);
        const shown = await page.goto(address, {waitUntil: "commit", timeout: TAB_WAIT_MS}).then(() => page.locator(".composer-input").waitFor({timeout: TAB_WAIT_MS})).then(() => true, () => false);
        tabMs.push(shown ? Date.now() - started : null);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const numbers = {tabs: TABS, openStreams: streams, mostStreams, openConnections: openConnections(), mostBlockedMs: Math.round(mostBlockedMs), tabMs};
    writeFileSync(numbersFile, JSON.stringify(numbers));
    assert.ok(tabMs.every((ms) => ms !== null), `a tab never drew its chat: ${JSON.stringify(numbers)}`);
    assert.equal(streams, 1, `one event stream serves every tab: ${JSON.stringify(numbers)}`);

    await send(pages[0], "Heard in every tab");
    await shows(pages[TABS - 1], "Heard in every tab");
    // the tab that holds the stream goes, and the stream passes on to another
    await pages[0].close();
    await send(pages[1], "Heard after the first tab left");
    await shows(pages[TABS - 1], "Heard after the first tab left");
    const held = await Promise.all(pages.slice(1).map((page) => page.evaluate(() => globalThis[Symbol.for("journal.transport")].inFlight().filter((flight) => flight.kind === "stream").length)));
    assert.equal(held.reduce((sum, streamsOfTab) => sum + streamsOfTab, 0), 1, `the stream passed on and is still one: ${held}`);
} finally {
    await browser.close();
}
