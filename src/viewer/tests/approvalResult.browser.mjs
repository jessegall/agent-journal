import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 720}});
    await page.goto(address);
    const card = page.locator(".chat-dock-card").filter({hasText: "Create a phone pairing code?"});
    await card.waitFor();
    await card.getByRole("button", {name: "Accept", exact: true}).click();
    await card.waitFor({state: "detached"});
    const output = page.locator("[data-action-output]");
    await output.waitFor();
    assert.match(await output.textContent(), /code: [A-Z]{4}-[A-Z]{4}/);
    assert.match(await output.textContent(), /\/pair#code=/);
    await page.getByRole("dialog", {name: "Action completed", exact: true}).getByRole("button", {name: "Close", exact: true}).click();
    await output.waitFor({state: "detached"});
} finally {
    await browser.close();
}
