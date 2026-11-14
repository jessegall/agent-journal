import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, shareLink, face, pairingCode] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
try {
    const page = await browser.newPage({viewport: face === "phone" ? {width: 390, height: 844} : {width: 1280, height: 960}});
    const link = new URL(address);
    if (face === "popout") {
        link.searchParams.set("view", "messages.chat");
        link.searchParams.set("float", "9");
    }
    if (face === "phone") {
        const paired = await page.request.post(new URL("/viewer/pair", address).href, {data: {code: pairingCode}});
        assert.equal(paired.status(), 200);
        link.searchParams.delete("key");
    }
    await page.goto(link.href);
    if (face === "phone") await page.locator('[data-face="phone"]').waitFor();
    const card = page.getByRole("region", {name: "Tax rules, waiting for you", exact: true});
    const button = card.getByRole("button", {name: "Review the plan", exact: true});
    await button.waitFor();
    assert.equal(await button.count(), 1);
    assert.ok((await button.getAttribute("title")).includes("acme.demo"));
    const labels = await card.locator(".dock-acts [data-button]").allTextContents();
    assert.ok(labels.findIndex((label) => label.includes("Approve")) < labels.findIndex((label) => label.includes("Review the plan")));
    await page.evaluate(() => { location.hash = "#?open=plans:6"; });
    const panel = page.locator("[data-plan-inspector]");
    await panel.getByRole("button", {name: "Approve", exact: true}).waitFor();
    const panelReview = panel.getByRole("button", {name: "Review the plan", exact: true});
    await panelReview.click();
    const prompt = page.locator(".allowance-prompt");
    await prompt.getByRole("button", {name: "Not now", exact: true}).click();
    await prompt.waitFor({state: "hidden"});
    assert.equal(await button.count(), 1);
    const readPlan = async () => (await (await page.request.post(new URL("/api/line", address).href,
        {data: {window: "viewer.shell", line: ["plan", "show", "6"], environment: "demo"}})).json()).value;
    assert.notEqual((await readPlan()).brief, "Reviewed");
    await panelReview.click();
    await prompt.getByRole("button", {name: "Allow", exact: true}).click();
    await prompt.waitFor({state: "hidden"});
    await page.waitForFunction(async () => {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify({window: "viewer.shell", line: ["plan", "show", "6"], environment: "demo"})});
        return (await response.json()).value?.brief === "Reviewed";
    });
    await panelReview.click();
    await page.waitForFunction(() => !document.querySelector('[data-button="demo.review"]').disabled);
    assert.equal(await prompt.count(), 0);
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
