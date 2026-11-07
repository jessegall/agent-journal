import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 720}});
    await page.goto(address);
    const approved = page.locator("[data-approval-question]").filter({hasText: "the end of the long rule"});
    const denied = page.locator("[data-approval-question]").filter({hasText: "Skip the tests"});
    await approved.waitFor();
    await denied.waitFor();
    const colour = await approved.evaluate((body) => getComputedStyle(body.closest(".chat-dock-card"), "::before").backgroundColor);
    const warn = await page.evaluate(() => {
        const probe = document.createElement("span");
        probe.style.color = "var(--tone-warn)";
        document.body.append(probe);
        const value = getComputedStyle(probe).color;
        probe.remove();
        return value;
    });
    assert.equal(colour, warn);
    const stack = page.locator(".chat-dock-card");
    await stack.filter({hasText: "Skip the tests"}).getByRole("button", {name: "Open"}).click();
    await page.locator("[data-resource-panel]").filter({hasText: "Skip the tests"}).waitFor();
    await page.locator("[data-resource-close]").first().click();
    await stack.filter({hasText: "the end of the long rule"}).getByRole("button", {name: "Accept", exact: true}).click();
    await approved.waitFor({state: "detached"});
    await stack.filter({hasText: "Skip the tests"}).getByRole("button", {name: "Refuse", exact: true}).click();
    await denied.waitFor({state: "detached"});
} finally {
    await browser.close();
}
