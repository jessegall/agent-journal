import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${address}&windows=agents.agents`);
    const bar = page.locator("[data-agent-bar]");
    const button = bar.getByRole("button", {name: "Process queue"});
    await button.waitFor();
    await page.locator('[data-window="agents.agents"]').waitFor();
    assert.equal(await page.locator('[data-window="agents.agents"]').getByRole("button", {name: "Process queue"}).count(), 0);
    await bar.locator("[data-work-mode]").waitFor();
    await button.click();
    const panel = page.locator("[data-resource-panel]");
    await page.locator("[data-queue-controls]").waitFor();
    assert.equal(Math.round((await panel.boundingBox()).width), 640);
    assert.match(await page.locator('[data-queue-row="running"]').innerText(), /make package/, await panel.innerText());
    assert.match(await page.locator('[data-queue-row="running"] [data-queue-task]').innerText(), /Task \d+/);
    assert.match(await page.locator('[data-queue-row="waiting"]').innerText(), /make checks/);
    assert.equal(await page.locator("[data-queue-position]").innerText(), "1");
    const recent = page.locator('[data-queue-row="recent"]');
    await recent.getByRole("button", {expanded: false}).click();
    await recent.locator("[data-queue-output-body]").filter({hasText: "package built"}).waitFor();
    assert.match(await recent.innerText(), /\$ /);
    assert.equal(await page.locator('[data-queue-row="running"] .dot').count(), 1);
    assert.deepEqual(await page.locator('.spots span').first().evaluate((element) => { const style = getComputedStyle(element); return [style.width, style.height, style.borderRadius]; }), ["14px", "14px", "4px"]);
    const popupPromise = page.waitForEvent("popup");
    await recent.getByRole("link", {name: "Open output window"}).click();
    const popup = await popupPromise;
    await popup.getByRole("button", {name: "Whole output", exact: true}).click();
    await popup.locator("[data-output-text]").filter({hasText: "package built"}).waitFor();
    await popup.close();
    await page.screenshot({path: capture, fullPage: true});
    const processId = await page.locator('[data-queue-row="running"]').getAttribute("data-queue-process");
    const stopped = await page.evaluate(async (id) => {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "processes.outputs", environment: "main", line: ["output", "stop", id]})});
        return response.json();
    }, processId);
    assert.equal(stopped.code, 0, JSON.stringify(stopped));
    await page.locator('[data-queue-row="running"]').filter({hasText: "make checks"}).waitFor();
    await page.locator('[data-queue-row="waiting"]').waitFor({state: "detached"});
    await page.screenshot({path: capture.replace(".png", "-events.png"), fullPage: true});
    await page.getByRole("button", {name: "One more command at once"}).click();
    await page.waitForFunction(() => document.querySelector("[data-queue-limit]")?.textContent === "2");
    await page.reload();
    await page.locator("[data-queue-controls]").waitFor();
    assert.equal(await page.locator("[data-queue-limit]").innerText(), "2");
    await page.setViewportSize({width: 390, height: 844});
    await page.waitForFunction(() => document.querySelector("[data-resource-panel]").getBoundingClientRect().width <= 390, null, {timeout: 5000});
    await page.locator('[data-queue-row="recent"]').first().getByRole("button", {expanded: false}).click();
    await page.screenshot({path: capture.replace(".png", "-phone.png"), fullPage: true});
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
