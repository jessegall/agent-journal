import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const DOTS_PATH = "M4 8h.01M8 8h.01M12 8h.01";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 900}, reducedMotion: "reduce"});
    await page.goto(address);
    await page.locator("[data-dock-fold]").click();
    const terminal = page.locator("[data-output-terminal]").first();
    await terminal.waitFor();
    const menu = page.locator("[data-output-report]").first();
    await menu.waitFor({state: "attached"});
    await page.mouse.move(0, 0);
    const shown = () => menu.evaluate((button) => Number(getComputedStyle(button).opacity));
    await page.waitForFunction((button) => Number(getComputedStyle(button).opacity) === 0, await menu.elementHandle());
    assert.ok((await menu.innerHTML()).includes(DOTS_PATH), "the output's menu is the three dots");
    await terminal.hover();
    await page.waitForFunction((button) => Number(getComputedStyle(button).opacity) === 1, await menu.elementHandle());
    assert.equal(await shown(), 1);
} finally {
    await browser.close();
}
