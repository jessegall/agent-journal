import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, worker, helper, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 960}, reducedMotion: "reduce"});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${address}&windows=agents.agents`);
    const window = page.locator('[data-window="agents.agents"]');
    const first = window.locator(`[data-agent-open="${worker}"]`);
    assert.equal(await first.getAttribute("role"), "button");
    assert.equal(await first.locator(".agent-name + .agent-chevron").count(), 1);
    for (const id of [worker, helper]) {
        const card = window.locator(`[data-agent-open="${id}"]`);
        await card.click();
        await card.locator(`[data-tab="transcript"]`).click();
        await card.getByText("Transcript row 119", {exact: false}).waitFor();
        const sizes = await window.evaluate((element) => {
            const card = element.querySelector('[aria-expanded="true"].agent-card');
            const body = card.querySelector("[data-agent-tab-body]");
            const pane = body.querySelector(".auto-scroll-pane");
            return {bottom: card.getBoundingClientRect().bottom, end: element.getBoundingClientRect().bottom, body: body.clientHeight, pane: pane.clientHeight, scroll: pane.scrollHeight, outer: element.scrollHeight, height: element.clientHeight, rows: pane.querySelectorAll('[data-row]').length, list: pane.querySelector('.row-list')?.clientHeight, first: pane.querySelector('[data-row]')?.clientHeight};
        });
        assert.ok(Math.abs(sizes.bottom - sizes.end) < 3, JSON.stringify(sizes));
        assert.ok(sizes.body >= 600 && sizes.pane > 500, JSON.stringify(sizes));
        assert.ok(sizes.scroll > sizes.pane, JSON.stringify(sizes));
        assert.ok(sizes.outer <= sizes.height + 2, JSON.stringify(sizes));
        await card.getByRole("button", {name: "Back", exact: true}).click();
    }
    await window.locator(`[data-agent-open="${worker}"]`).click();
    const card = window.locator(`[data-agent-open="${worker}"]`);
    await card.locator('[data-tab="file-feed"]').click();
    await card.locator(".file-feed [data-row-list-empty]").waitFor();
    await page.setViewportSize({width: 1000, height: 1200});
    const feed = await card.locator(".file-feed").boundingBox();
    assert.ok(feed.height > 800, JSON.stringify(feed));
    await page.setViewportSize({width: 1000, height: 700});
    const smaller = await card.locator(".file-feed").boundingBox();
    assert.ok(smaller.height < feed.height - 400 && smaller.height > 300, JSON.stringify(smaller));
    await page.setViewportSize({width: 1000, height: 960});
    await card.locator('[data-tab="transcript"]').click();
    await card.getByText("Transcript row 119", {exact: false}).waitFor();
    const widths = await window.evaluate((element) => {
        const card = element.querySelector('[aria-expanded="true"].agent-card');
        const command = card.querySelector("[data-agent-command]");
        const before = card.getBoundingClientRect().width;
        const walker = document.createTreeWalker(command, NodeFilter.SHOW_TEXT);
        const text = walker.nextNode();
        text.textContent = "python3 -c ".repeat(400);
        return {before, after: card.getBoundingClientRect().width, command: command.getBoundingClientRect().width, overflow: element.scrollWidth - element.clientWidth};
    });
    assert.ok(Math.abs(widths.before - widths.after) < 1, JSON.stringify(widths));
    assert.ok(widths.overflow <= 0, JSON.stringify(widths));
    await page.screenshot({path: capture, fullPage: true, animations: "disabled"});
    await page.setViewportSize({width: 390, height: 844});
    await page.goto(`${address}&windows=agents.agents`);
    await window.locator(`[data-agent-open="${worker}"]`).click();
    await card.getByRole("button", {name: "Back", exact: true}).waitFor();
    assert.ok(await window.evaluate((element) => element.scrollWidth <= element.clientWidth));
    await page.screenshot({path: capture.replace(".png", "-phone.png"), fullPage: true, animations: "disabled"});
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
