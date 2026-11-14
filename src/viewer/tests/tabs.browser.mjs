import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1300, height: 800}});
    await page.goto(address);
    const tabs = page.locator('[role="tab"][data-tab]');
    await tabs.first().waitFor();
    const chat = page.locator('[role="tab"][data-tab*="chat"]').first();
    await chat.waitFor();
    const key = await chat.getAttribute("data-tab");
    const cross = chat.locator(".pane-tab-x");
    const widthBefore = (await chat.boundingBox()).width;
    await page.mouse.move(0, 0);
    if (!(await chat.evaluate((element) => element.classList.contains("on")))) assert.equal(await cross.evaluate((element) => getComputedStyle(element).opacity), "0");
    await chat.hover();
    assert.equal(await cross.evaluate((element) => getComputedStyle(element).opacity), "1");
    assert.equal((await chat.boundingBox()).width, widthBefore, "the cross has a reserved slot, so the tab does not grow");
    await chat.click({button: "middle"});
    await page.locator(`[role="tab"][data-tab="${key}"]`).waitFor({state: "detached"});
} finally {
    await browser.close();
}
