import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    await page.goto(address);
    const card = page.locator('.chat-dock-card[aria-label="Tax rules"]');
    const button = card.getByRole("button", {name: "Review the plan", exact: true});
    await button.waitFor();
    assert.equal(await button.count(), 1);
    assert.ok((await button.getAttribute("title")).includes("acme.demo"));
    console.log("The installed module's button appears on the demo's ready plan card");
} finally {
    await browser.close();
}
