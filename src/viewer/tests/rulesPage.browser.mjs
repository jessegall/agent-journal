import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 720}});
    await page.goto(address);
    await page.getByText("Rules", {exact: true}).first().click();
    const proposed = page.locator('[data-rule-state="proposed"]');
    const active = page.locator('[data-rule-state="active"]');
    await proposed.filter({hasText: "Skip the tests"}).waitFor();
    await active.filter({hasText: "Name things plainly"}).waitFor();
    await proposed.filter({hasText: "Skip the tests"}).getByRole("button", {name: "Approve"}).click();
    await active.filter({hasText: "Skip the tests"}).waitFor();
    assert.equal(await proposed.count(), 0);
    await active.filter({hasText: "Name things plainly"}).getByRole("button", {name: "Remove"}).click();
    await active.filter({hasText: "Name things plainly"}).waitFor({state: "detached"});
} finally {
    await browser.close();
}
