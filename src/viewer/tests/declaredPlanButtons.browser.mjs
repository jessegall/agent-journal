import assert from "node:assert/strict";
import http from "node:http";
import {chromium} from "playwright-core";

const [address, socketPath, screenshot] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});

async function run(argv) {
    const answer = await new Promise((resolve, reject) => {
        const request = http.request({socketPath, path: "/cli", method: "POST"}, (response) => {
            let body = "";
            response.on("data", (chunk) => { body += chunk; });
            response.on("end", () => resolve({body, code: response.trailers["journal-exit-code"]}));
        });
        request.on("error", reject);
        request.end(JSON.stringify({argv: [...argv, "--json"], folder: "/", variables: {USER: "Demo"}}));
    });
    assert.equal(answer.code, "0", JSON.stringify(answer));
    return JSON.parse(answer.body);
}

try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    await page.addInitScript(() => {
        const NativeEventSource = window.EventSource;
        window.EventSource = class extends NativeEventSource {
            set onmessage(listener) {
                super.onmessage = (event) => { if (!window.holdEvents) listener(event); };
            }
            addEventListener(type, listener, ...options) {
                super.addEventListener(type, (event) => { if (!window.holdEvents) listener(event); }, ...options);
            }
        };
    });
    const link = new URL(address);
    link.searchParams.set("environment", "demo");
    await page.goto(link.href);
    const plans = await run(["plan", "list", "--environment", "demo"]);
    const plan = plans.rows.find((row) => row.title === "Tax rules");
    assert.ok(plan);
    const card = page.locator('.chat-dock-card[aria-label^="Tax rules"]');
    await card.getByRole("button", {name: "Approve the plan", exact: true}).waitFor();
    assert.equal(await card.getByRole("button", {name: "Approve the plan", exact: true}).count(), 1);
    assert.equal(await card.getByRole("button", {name: "Ask for a critique of the plan", exact: true}).count(), 1);
    await page.evaluate((id) => { location.hash = `#?open=plans:${id}`; }, plan.id);
    const panel = page.locator("[data-plan-inspector]");
    await panel.getByRole("button", {name: "Approve the plan", exact: true}).waitFor();
    assert.equal(await panel.getByRole("button", {name: "Approve the plan", exact: true}).count(), 1);
    assert.equal(await panel.getByRole("button", {name: "Ask for a critique of the plan", exact: true}).count(), 1);
    await panel.locator("[data-resource-close]").click();
    await panel.waitFor({state: "hidden"});

    console.log("Asking for a critique from the demo plan card");
    await card.getByRole("button", {name: "Ask for a critique of the plan", exact: true}).click();
    const form = page.locator("[data-button-form]");
    await form.getByRole("radio", {name: /Find what is missing/}).click();
    await form.getByRole("button", {name: "Send", exact: true}).click();
    await form.waitFor({state: "hidden"});
    const messages = await run(["message", "list", "--environment", "demo"]);
    assert.ok(messages.rows.some((message) => message.text.includes(`Please have 2 agents give plan ${plan.id} a normal read, following template`) && message.text.includes("(Find what is missing), and compile what they find into a report linked to the plan.")));
    assert.equal((await run(["plan", "show", String(plan.id)])).state, "reviewing");

    console.log("Ending the review from the card");
    const endReview = card.getByRole("button", {name: "End the review of the plan", exact: true});
    await endReview.waitFor();
    assert.equal(await card.getByRole("button", {name: "Approve the plan", exact: true}).count(), 0);
    await endReview.click();
    await card.getByRole("button", {name: "Approve the plan", exact: true}).waitFor();
    assert.equal((await run(["plan", "show", String(plan.id)])).state, "ready");

    console.log("Checking the phone title, reachable approval and approval message sheet");
    await page.setViewportSize({width: 360, height: 780});
    const approve = card.getByRole("button", {name: "Approve the plan", exact: true});
    await approve.scrollIntoViewIfNeeded();
    const bounds = await approve.boundingBox();
    const title = await card.locator(".dock-title").boundingBox();
    assert.ok(bounds && bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= 360);
    assert.ok(title && title.width > 0);
    await page.screenshot({path: screenshot, fullPage: true});
    await card.getByRole("button", {name: "Other ways to approve", exact: true}).click();
    await page.getByRole("button", {name: /Approve with a message/}).click();
    await form.locator("textarea").fill("Skip phase 3 for now");
    const sheet = page.locator(".dialog.sheet .dialog-panel");
    await page.locator(".dialog.sheet:not(.dialog-enter-active) .dialog-panel").waitFor();
    const sheetBounds = await sheet.boundingBox();
    assert.ok(sheetBounds && Math.abs(sheetBounds.y + sheetBounds.height - 768) < 2, JSON.stringify(sheetBounds));
    await form.getByRole("button", {name: "Send", exact: true}).click();
    await form.waitFor({state: "hidden"});
    assert.equal((await run(["plan", "show", String(plan.id)])).state, "approved");
    assert.ok((await run(["message", "list", "--environment", "demo"])).rows.some((message) => message.text === "Skip phase 3 for now"));

    console.log("Refusing a stale approval with the command's lifecycle error");
    const stale = await run(["plan", "make", "Stale approval", "--environment", "demo"]);
    await run(["plan", "ready", String(stale.id), "--environment", "demo"]);
    const staleCard = page.locator('.chat-dock-card[aria-label^="Stale approval"]');
    await staleCard.getByRole("button", {name: "Approve the plan", exact: true}).waitFor();
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => { window.holdEvents = true; });
    await run(["plan", "cancel", String(stale.id), "--reason", "Replaced", "--environment", "demo"]);
    await staleCard.getByRole("button", {name: "Approve the plan", exact: true}).click();
    await staleCard.getByRole("alert").getByText(`plan ${stale.id} is cancelled, so it cannot approve`, {exact: false}).waitFor();
    assert.equal((await run(["plan", "show", String(stale.id)])).state, "cancelled");
    console.log("Declared plan button browser stories passed");
} finally {
    await browser.close();
}
