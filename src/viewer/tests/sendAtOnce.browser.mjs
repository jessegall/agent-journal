import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {chromium} from "playwright-core";

const [address, numbersFile] = process.argv.slice(2);
const AT_ONCE_MS = 500;
const SEND_WAIT_MS = 3000;
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
const stall = () => new Promise(() => {});
const sent = (request, words) => JSON.stringify(request.postDataJSON()).includes(words);

// the time from the key press to the message on the page, and whether the write left while no read had answered
async function echoMs(page, words) {
    const box = page.locator(".composer-input");
    await box.fill(words);
    const started = Date.now();
    await box.press("Enter");
    const shown = await page.locator("[data-message]", {hasText: words}).first().waitFor({timeout: AT_ONCE_MS * 4}).then(() => true, () => false);
    return shown ? Date.now() - started : null;
}

try {
    const context = await browser.newContext({viewport: {width: 1280, height: 900}});
    const numbers = {};

    // the whole network stalls on a page that has drawn
    const loaded = await context.newPage();
    await loaded.goto(address);
    await loaded.locator(".composer-input").waitFor();
    let writeLeft = false;
    await loaded.route(/\/api\/lines?$/, async (route) => {
        writeLeft ||= sent(route.request(), "Sent on a stalled network");
        await stall();
    });
    numbers.stalledEchoMs = await echoMs(loaded, "Sent on a stalled network");
    await new Promise((resolve) => setTimeout(resolve, SEND_WAIT_MS));
    numbers.writeLeftWhileReadsStalled = writeLeft;
    await loaded.close();

    // the chat's first read never answers, so the list has nothing but the message
    const first = await context.newPage();
    await first.route(/\/api\/lines?$/, async (route) => {
        if (!sent(route.request(), "message")) return route.continue();
        if (sent(route.request(), "Sent before the first read")) return route.continue();
        await stall();
    });
    await first.goto(address);
    await first.locator(".composer-input").waitFor();
    numbers.firstReadStalledEchoMs = await echoMs(first, "Sent before the first read");
    await first.close();

    // two identical writes are two messages: a write is never joined
    const twice = await context.newPage();
    await twice.goto(address);
    await twice.locator(".composer-input").waitFor();
    for (const round of [1, 2]) {
        await twice.locator(".composer-input").fill("The same words twice");
        await twice.locator(".composer-input").press("Enter");
    }
    const saved = twice.locator("[data-message]:not([data-ref*=sending-])", {hasText: "The same words twice"});
    await twice.waitForFunction(() => [...document.querySelectorAll("[data-message]")].filter((row) => row.textContent.includes("The same words twice") && !row.dataset.ref.includes("sending-")).length === 2);
    numbers.identicalWritesSaved = await saved.count();
    writeFileSync(numbersFile, JSON.stringify(numbers));

    assert.ok(numbers.stalledEchoMs !== null && numbers.stalledEchoMs < AT_ONCE_MS, `a sent message shows at once on a stalled network: ${JSON.stringify(numbers)}`);
    assert.ok(numbers.writeLeftWhileReadsStalled, `the write waits for no read: ${JSON.stringify(numbers)}`);
    assert.ok(numbers.firstReadStalledEchoMs !== null && numbers.firstReadStalledEchoMs < AT_ONCE_MS, `a sent message shows before the chat's first read answers: ${JSON.stringify(numbers)}`);
} finally {
    await browser.close();
}
