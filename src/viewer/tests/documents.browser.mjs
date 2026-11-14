import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 800}});
    await page.goto(`${address}&page=documents.page`);
    const row = page.locator("[data-reader-row]", {hasText: "Cart rules"});
    await row.waitFor();
    assert.equal(await page.locator("[data-documents-term] button").count(), 2);
    await row.click();
    await page.locator("[data-document-reader]").waitFor();
    await page.locator('[data-tab="revisions"]').click();
    await page.locator("[data-reader-timeline] li").first().waitFor();
    await row.click({button: "right"});
    assert.equal(await page.locator("[data-menu-item]", {hasText: /delete|duplicate/i}).count(), 0);
} finally {
    await browser.close();
}
