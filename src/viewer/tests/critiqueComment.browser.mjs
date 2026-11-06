import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1200, height: 900}});
    await page.goto(`${address}#/?open=plans:1`);
    const inspector = page.locator("[data-plan-tabs]");
    await inspector.getByRole("radio", {name: "Comments"}).click();
    await page.locator("[data-comment-side]").getByText(/Plan critique/).waitFor();
    assert.equal(await page.locator("[data-message-text]").getByText(/Plan critique/).count(), 0);
    await page.screenshot({path: capture, fullPage: true, animations: "disabled"});
} finally {
    await browser.close();
}
