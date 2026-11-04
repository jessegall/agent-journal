import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, shareLink] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    await page.goto(address);
    const card = page.locator('.chat-dock-card[aria-label="Tax rules"]');
    const button = card.getByRole("button", {name: "Review the plan", exact: true});
    await button.waitFor();
    assert.equal(await button.count(), 1);
    assert.ok((await button.getAttribute("title")).includes("acme.demo"));
    const labels = await card.locator(".dock-acts [data-button]").allTextContents();
    assert.ok(labels.findIndex((label) => label.includes("Approve")) < labels.findIndex((label) => label.includes("Review the plan")));
    await button.click();
    const prompt = page.locator(".allowance-prompt");
    await prompt.getByRole("button", {name: "Not now", exact: true}).click();
    await prompt.waitFor({state: "hidden"});
    assert.equal(await button.count(), 1);
    const readPlan = async () => (await (await page.request.post(new URL("/api/line", address).href,
        {data: {window: "viewer.shell", line: ["plan", "show", "6"], environment: "demo"}})).json()).value;
    assert.notEqual((await readPlan()).brief, "Reviewed");
    await button.click();
    await prompt.getByRole("button", {name: "Allow", exact: true}).click();
    await prompt.waitFor({state: "hidden"});
    await page.waitForFunction(async () => {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify({window: "viewer.shell", line: ["plan", "show", "6"], environment: "demo"})});
        return (await response.json()).value?.brief === "Reviewed";
    });
    await button.click();
    await page.waitForFunction(() => !document.querySelector('[data-button="demo.review"]').disabled);
    assert.equal(await prompt.count(), 0);
    await page.evaluate(() => { location.hash = "#?open=plans:6"; });
    const panel = page.locator("[data-plan-inspector]");
    await panel.getByRole("button", {name: "Review the plan", exact: true}).waitFor();
    await panel.getByRole("button", {name: "Approve", exact: true}).click();
    await panel.locator("[data-plan-status]").filter({hasText: "Approved"}).waitFor();
    await button.waitFor({state: "hidden"});
    await panel.locator("[data-resource-close]").click();
    const visitor = await browser.newContext();
    const shared = await visitor.newPage();
    await shared.goto(new URL(shareLink, address).href);
    await shared.locator("[data-share-body]").waitFor();
    assert.equal(await shared.locator("[data-button]").count(), 0);
    assert.equal(await shared.locator(".allowance-prompt").count(), 0);
    await visitor.close();
    console.log("Demo module slots, allowance choices, live row changes and the read-only share passed");
} finally {
    await browser.close();
}
