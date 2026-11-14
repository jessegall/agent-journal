import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 900}});
    const refused = "journal.core.developer.tools.hooks.request-log";
    await page.route("**/api/line", async (route) => {
        const sent = route.request().postData() ?? "";
        if (!sent.includes(refused)) return route.continue();
        await route.fulfill({status: 400, contentType: "application/json", body: JSON.stringify({error: "The request log needs a larger disk"})});
    });
    await page.goto(`${address}&page=settings.settings`);
    await page.locator('[data-section="developer"]').click();
    await page.locator("[data-developer-switch]").click();
    await page.locator(`[data-setting="${refused}"] [data-flag-switch]`).click();
    assert.match(await page.locator("[data-settings-note]").textContent(), /2 changes/);
    await page.locator("[data-settings-apply]").click();
    const row = page.locator(`[data-setting="${refused}"]`);
    await row.locator("[data-setting-refused]").waitFor();
    assert.equal(await row.locator("[data-setting-refused]").textContent(), "The request log needs a larger disk");
    await page.waitForFunction(() => /1 change/.test(document.querySelector("[data-settings-note]")?.textContent ?? ""));
    await page.locator('[data-sidebar-window="developer.system-logs"]').waitFor();
} finally {
    await browser.close();
}
