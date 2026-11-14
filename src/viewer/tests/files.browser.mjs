import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, agent] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 800}});
    await page.goto(`${address}&agent=${agent}`);
    const open = page.locator("[data-diff-open]").first();
    await open.waitFor();
    await open.click();
    const inspector = page.locator("[data-file-inspector]");
    await inspector.waitFor();
    assert.equal(await inspector.locator("[data-resource-title]").textContent(), "cart.py");
    const wide = await inspector.evaluate((element) => element.getBoundingClientRect().width / window.innerWidth);
    assert.ok(wide <= 0.921, `the file inspector takes ${wide} of the window`);
    const line = inspector.locator("[data-line-number]").first();
    await line.waitFor({timeout: 10000});
    await line.click();
    await inspector.locator(".files-line.picked").first().waitFor();
    await inspector.locator("[data-file-inspector-open]").click();
    await page.waitForURL(/page=coding\.files/);
} finally {
    await browser.close();
}
