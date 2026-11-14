import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 800}});
    await page.goto(`${address}&page=reminders.reminders`);
    await page.locator("[data-reminder-new]").waitFor();
    await page.locator("[data-reminder-new]").click();
    await page.locator('[data-field="text"]').fill("Look at the build");
    await page.locator('[data-field="repeat"]').selectOption("minutes");
    await page.locator('[data-field="every"]').fill("30");
    await page.locator("[data-create-send]").click();
    const row = page.locator("[data-reader-row]", {hasText: "Look at the build"});
    await row.waitFor();
    assert.equal(await row.locator("[data-reminder-rule]").textContent(), "Every 30 min");
    assert.ok(await row.locator("[data-reminder-agent]").isVisible());
    await row.click();
    await page.locator("[data-reminder-reader]").waitFor();
    assert.ok(await page.locator("[data-reminder-reader] [data-agent-badge]").first().isVisible());
} finally {
    await browser.close();
}
