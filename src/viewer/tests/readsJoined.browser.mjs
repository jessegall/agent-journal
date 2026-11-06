import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {chromium} from "playwright-core";

const [address, numbersFile] = process.argv.slice(2);
const SERVER_MS = 600;
const STUCK_LINE = "usage tool";
const STUCK_WAIT_MS = 9000;
const WRITES = /^(message (send|reply|comment)|viewer-layout save|window save-setting)/;
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
const linesOf = (request) => {
    const body = request.postDataJSON();
    return body.lines ?? [body];
};
const wordsOf = (entry) => entry.line.join(" ");
const keyOf = (entry) => `${entry.window} ${entry.environment} ${wordsOf(entry)}`;

try {
    const context = await browser.newContext({viewport: {width: 1280, height: 900}});
    const page = await context.newPage();
    const flying = new Map();
    const repeated = new Set();
    let requests = 0;
    let batches = 0;
    let atOnce = 0;
    let mostAtOnce = 0;
    await page.route(/\/api\/lines?$/, async (route) => {
        const reads = linesOf(route.request()).filter((entry) => !WRITES.test(wordsOf(entry)));
        requests += 1;
        batches += route.request().url().endsWith("/api/lines") ? 1 : 0;
        atOnce += 1;
        mostAtOnce = Math.max(mostAtOnce, atOnce);
        for (const read of reads) {
            if (flying.get(keyOf(read))) repeated.add(keyOf(read));
            flying.set(keyOf(read), (flying.get(keyOf(read)) ?? 0) + 1);
        }
        await new Promise((resolve) => setTimeout(resolve, SERVER_MS));
        atOnce -= 1;
        for (const read of reads) flying.set(keyOf(read), flying.get(keyOf(read)) - 1);
        await route.continue().catch(() => {});
    });
    await page.goto(address);
    await page.locator(".composer-input").waitFor();
    // a second tab, which the slow server does not touch, sends: each message is an event the slow tab reads again for
    const sender = await context.newPage();
    await sender.goto(address);
    await sender.locator(".composer-input").waitFor();
    for (const words of ["First while reading", "Second while reading", "Third while reading"]) {
        await sender.locator(".composer-input").fill(words);
        await sender.locator(".composer-input").press("Enter");
        await new Promise((resolve) => setTimeout(resolve, SERVER_MS / 2));
    }
    // the last event came while a read was in flight, so one more read after it must show the last message
    await page.locator("[data-message]", {hasText: "Third while reading"}).first().waitFor({timeout: 15000});
    await page.unrouteAll({behavior: "ignoreErrors"});
    const numbers = {requests, batches, mostAtOnce, repeatedReads: [...repeated]};
    await sender.close();

    const stuck = await context.newPage();
    await stuck.route(/\/api\/lines?$/, async (route) => {
        const asked = linesOf(route.request()).some((entry) => wordsOf(entry).startsWith(STUCK_LINE));
        if (!asked) return route.continue();
        await new Promise(() => {});
    });
    const started = Date.now();
    await stuck.goto(address);
    const drawn = await stuck.locator("[data-message]").first().waitFor({timeout: STUCK_WAIT_MS}).then(() => true, () => false);
    numbers.rowsBesideStuckReadMs = drawn ? Date.now() - started : null;
    writeFileSync(numbersFile, JSON.stringify(numbers));
    assert.deepEqual(numbers.repeatedReads, [], `the same read of the same window ran twice at once: ${JSON.stringify(numbers)}`);
    assert.ok(mostAtOnce <= 5, `a stream and a write always find a connection: ${JSON.stringify(numbers)}`);
    assert.ok(drawn, `a stuck read held the other reads up: ${JSON.stringify(numbers)}`);
} finally {
    await browser.close();
}
