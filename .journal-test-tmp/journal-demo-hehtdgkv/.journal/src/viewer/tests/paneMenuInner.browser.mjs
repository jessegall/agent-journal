import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 800}});
    await page.goto(address);
    await page.locator(".pane-menu-button").first().click();
    const row = page.locator(".pane-menu [data-menu-inner]").first();
    await row.waitFor({state: "visible"});
    const list = page.locator(".pane-menu [data-menu-inner-list]").first();
    assert.equal(await list.isVisible(), false, "the choices show before the row is opened");
    await row.click();
    await list.waitFor({state: "visible"});
    const tops = await list.locator("[data-choice]").evaluateAll((choices) => choices.map((choice) => choice.getBoundingClientRect().top));
    assert.equal(new Set(tops).size, tops.length, "two choices share a line");
    await list.locator("[data-menu-back]").click();
    await list.waitFor({state: "hidden"});
} finally {
    await browser.close();
}
