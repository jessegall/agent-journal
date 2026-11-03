import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${address}#/?open=test_queue:0`);
    const panel = page.locator("[data-resource-panel]");
    await page.locator("[data-queue-controls]").waitFor();
    assert.equal(Math.round((await panel.boundingBox()).width), 660);
    assert.match(await page.locator('[data-queue-row="running"]').innerText(), /make package/);
    assert.match(await page.locator('[data-queue-row="running"] [data-queue-task]').innerText(), /Task \d+/);
    assert.match(await page.locator('[data-queue-row="waiting"]').innerText(), /make checks/);
    assert.equal(await page.locator("[data-queue-position]").innerText(), "1");
    const recent = page.locator('[data-queue-row="recent"]');
    await recent.locator("[data-queue-output]").click();
    await recent.locator("[data-queue-output-body]").filter({hasText: "package built"}).waitFor();
    await page.screenshot({path: capture, fullPage: true});
    const processId = await page.locator('[data-queue-row="running"]').getAttribute("data-queue-process");
    const stopped = await page.evaluate(async (id) => {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "processes.outputs", environment: "main", line: ["output", "stop", id]})});
        return response.json();
    }, processId);
    assert.equal(stopped.code, 0, JSON.stringify(stopped));
    await page.locator('[data-queue-row="running"]').filter({hasText: "make checks"}).waitFor();
    assert.equal(await page.locator('[data-queue-row="waiting"]').count(), 0);
    await page.screenshot({path: capture.replace(".png", "-events.png"), fullPage: true});
    await page.getByRole("button", {name: "More runs at once"}).click();
    await page.waitForFunction(() => document.querySelector("[data-queue-limit]")?.textContent === "2");
    await page.locator("[data-queue-main-spots]").click();
    await page.waitForFunction(() => document.querySelector("[data-queue-main-spots]")?.getAttribute("aria-checked") === "true");
    await page.reload();
    await page.locator("[data-queue-controls]").waitFor();
    assert.equal(await page.locator("[data-queue-limit]").innerText(), "2");
    assert.equal(await page.locator("[data-queue-main-spots]").getAttribute("aria-checked"), "true");
    await page.setViewportSize({width: 390, height: 844});
    assert.ok((await panel.boundingBox()).width <= 390);
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
