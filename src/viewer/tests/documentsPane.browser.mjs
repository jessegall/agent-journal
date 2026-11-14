import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.goto(address);
    await page.locator("[data-add-window]").first().click();
    await page.locator('[data-reopen="documents.documents"]').click();
    const row = page.locator(".library-row").filter({hasText: "Cart rules"});
    await row.waitFor({state: "visible"});
    const box = await page.locator(".library-body").boundingBox();
    assert.ok(box.width > 0 && box.height > 100, `the library has no room in the pane: ${JSON.stringify(box)}`);
    const search = await page.locator(".library-bar .search-bar-control").boundingBox();
    assert.ok(search.width >= 200, `the search box is squeezed to ${search.width} pixels`);
    await page.waitForTimeout(500);
    await page.screenshot({path: `${capture}-pane.png`, animations: "disabled"});
    await row.click();
    await page.getByText("Intro line").first().waitFor();
    await page.screenshot({path: `${capture}-open.png`, animations: "disabled"});
    const link = await page.locator('[data-sidebar-window="documents.documents"]').first().getAttribute("href");
    await page.goto(new URL(link, address).href);
    await page.locator(".library-row").filter({hasText: "Cart rules"}).waitFor({state: "visible"});
    await page.waitForTimeout(500);
    await page.screenshot({path: `${capture}-page.png`, animations: "disabled"});
} finally {
    await browser.close();
}
