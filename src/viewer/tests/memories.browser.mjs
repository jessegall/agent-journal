import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 800}});
    await page.goto(`${address}&page=memories.memories`);
    const row = page.locator("[data-reader-row]", {hasText: "Totals are in cents"});
    await row.waitFor();
    assert.equal(await page.locator("[data-memories-new]").count(), 0);
    await row.click();
    await page.locator("[data-actions-menu]").click();
    await page.locator("[data-menu-item]", {hasText: "Weigh"}).click();
    await page.locator("[data-menu-item]", {hasText: /^8$/}).click();
    await page.locator("[data-actions-menu]").click();
    await page.locator("[data-menu-item]", {hasText: "Remove"}).click();
    await page.locator("[data-menu-item]", {hasText: "Remove: click again"}).click();
    await page.locator("[data-toast-undo]").click();
    await row.waitFor();
} finally {
    await browser.close();
}
