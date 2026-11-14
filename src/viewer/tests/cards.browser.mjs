import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 800}});
    for (const [name, title] of [["mcp.integrations", "Integrations"], ["plugins.plugins", "Plugins"], ["secrets.secrets", "Secrets"], ["checks.checks", "Checks"]]) {
        await page.goto(`${address}&page=${name}`);
        await page.locator("[data-card-page]").waitFor();
        assert.equal(await page.locator("[data-page-header] h1").first().innerText().then((text) => text.replace(/\d+$/, "").trim()), title);
        assert.ok(await page.locator("[data-filter-bar]").isVisible());
    }
} finally {
    await browser.close();
}
