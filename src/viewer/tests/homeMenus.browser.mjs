import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, agent] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const context = await browser.newContext({viewport: {width: 1300, height: 800}, permissions: ["clipboard-read", "clipboard-write"]});
    const page = await context.newPage();
    await page.goto(address);
    const message = page.locator("[data-message]", {hasText: "Copy this message"}).first();
    await message.waitFor();
    await message.click({button: "right"});
    const menu = page.locator("[data-context-menu]");
    await menu.waitFor();
    await menu.locator("[data-menu-item]", {hasText: "Copy text"}).click();
    await menu.waitFor({state: "detached"});
    await page.waitForFunction(async () => (await navigator.clipboard.readText()) === "Copy this message");
    await page.goto(`${address}&agent=${agent}`);
    const command = page.locator("[data-terminal-command]", {hasText: "make check"}).first();
    await command.waitFor();
    await command.click({button: "right"});
    await menu.waitFor();
    assert.deepEqual(await menu.locator(".context-label").allTextContents(), ["Show output", "Copy command", "Run again"]);
    await menu.locator("[data-menu-item]", {hasText: "Copy command"}).click();
    await page.waitForFunction(async () => (await navigator.clipboard.readText()) === "make check");
} finally {
    await browser.close();
}
