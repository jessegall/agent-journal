import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 800}});
    await page.goto(`${address}&page=skills.skills`);
    const row = page.locator("[data-reader-row]").first();
    await row.waitFor();
    await row.click();
    await page.locator("[data-skill-reader]").waitFor();
    assert.equal(await page.locator("[data-tab]").count(), 4);
    await row.click({button: "right"});
    await page.locator("[data-menu-item]", {hasText: "Turn on"}).click();
    await row.locator("[data-skill-required]").waitFor();
    await row.click({button: "right"});
    await page.locator("[data-menu-item]", {hasText: "Turn off"}).click();
    await row.locator("[data-skill-required]").waitFor({state: "detached"});
} finally {
    await browser.close();
}
