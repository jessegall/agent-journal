import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 720}});
    await page.goto(`${address}&page=tasks.tasks`);
    const row = page.locator("[data-sidebar-window]").first();
    await row.waitFor();
    await page.locator(".ajs-cover").waitFor({state: "detached"});
    const name = await row.getAttribute("data-sidebar-window");
    await row.click({button: "right"});
    const menu = page.locator("[data-context-menu]");
    await menu.waitFor();
    const items = await menu.locator(".context-label").allTextContents();
    assert.deepEqual(items, ["Open", "Open in a new tab", "Copy link"]);
    assert.equal(await menu.locator("[data-context-head]").textContent(), (await row.getAttribute("title")) || name);
    assert.ok(await row.evaluate((element) => element.classList.contains("menu-target")), "the row the menu belongs to wears the ring");
    await page.keyboard.press("Escape");
    await menu.waitFor({state: "detached"});
    assert.ok(!(await row.evaluate((element) => element.classList.contains("menu-target"))), "the ring goes when the menu closes");
} finally {
    await browser.close();
}
