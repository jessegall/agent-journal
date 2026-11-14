import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 800}});
    await page.goto(`${address}&page=sequences.sequences`);
    await page.locator("[data-sequence-new]").waitFor();
    await page.locator("[data-sequence-new]").click();
    await page.locator('[data-field="title"]').fill("Shipping");
    await page.locator("[data-step-text]").first().fill("Run the tests");
    await page.locator("[data-step-add]").click();
    await page.locator("[data-step-text]").nth(1).fill("Tag it");
    await page.locator("[data-create-send]").click();
    const row = page.locator("[data-reader-row]", {hasText: "Shipping"});
    await row.waitFor();
    await row.click();
    await page.locator("[data-sequence-reader]").waitFor();
    assert.equal(await page.locator("[data-step]").count(), 2);
    await page.locator('[data-tab="runs"]').click();
    await page.locator("[data-runs-none]").waitFor();
} finally {
    await browser.close();
}
