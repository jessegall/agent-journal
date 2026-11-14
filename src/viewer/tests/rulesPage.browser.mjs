import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 800}});
    await page.goto(address);
    await page.getByText("Rules", {exact: true}).first().click();
    const proposed = page.locator("[data-reader-row]", {hasText: "Skip the tests"});
    const active = page.locator("[data-reader-row]", {hasText: "Name things plainly"});
    await proposed.waitFor();
    await active.waitFor();
    assert.equal(await page.locator(".list-reader-group").first().textContent(), "Waiting for you");
    await proposed.click();
    await page.locator("[data-rule-approve]").click();
    await page.locator("[data-rule-approve]").waitFor({state: "detached"});
    await active.click();
    await page.locator("[data-actions-menu]").click();
    await page.locator("[data-menu-item]", {hasText: "Remove"}).click();
    await page.locator("[data-menu-item]", {hasText: "Remove: click again"}).click();
    await active.waitFor({state: "detached"});
} finally {
    await browser.close();
}
