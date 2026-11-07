import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
const page = await browser.newPage({viewport: {width: 1280, height: 1000}});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("requestfailed", (request) => { if (new URL(request.url()).pathname.startsWith("/viewer/")) errors.push(`${request.url()}: ${request.failure()?.errorText}`); });
try {
    await page.goto(address);
    await page.locator("[data-workers]").click();
    const dropdown = page.locator('[data-dropdown="workers.workers"]');
    await dropdown.getByRole("tab", {name: "Split", exact: true}).click();
    const panel = dropdown.locator("[data-worker-split]");
    const slider = panel.getByRole("slider", {name: "Claude Code share"});
    const writes = [];
    page.on("request", (request) => {
        if (request.method() === "POST" && request.url().endsWith("/api/line")) {
            const body = request.postDataJSON();
            if (body.line?.[0] === "setting" && body.line[2] === "journal.core.helpers.program-split") writes.push(body);
        }
    });
    await slider.evaluate((element) => {
        for (const value of [60, 65]) { element.value = String(value); element.dispatchEvent(new Event("input", {bubbles: true})); }
        element.dispatchEvent(new Event("change", {bubbles: true}));
    });
    await page.waitForFunction(() => [...document.querySelectorAll("[data-worker-split] output")].map((node) => node.textContent).join(",") === "65%,35%");
    const form = panel.locator("[data-split-route-form]");
    await form.getByLabel("Route tags").selectOption(["networking", "linux"]);
    await form.getByLabel("Route program").selectOption("codex");
    await form.getByLabel("Route tier").selectOption("strongest");
    await form.getByRole("button", {name: "Add route", exact: true}).click();
    await panel.locator("[data-split-route]").filter({hasText: "codex"}).waitFor();
    const program = panel.locator('[data-split-program="codex"]');
    await program.getByRole("button", {name: "Mark out", exact: true}).click();
    const outage = panel.locator("[data-split-outage-form]");
    await outage.getByLabel("Outage reason").fill("out of credit");
    await outage.getByLabel("Outage ends at").fill("2027-01-01T12:00");
    await outage.getByRole("button", {name: "Mark out", exact: true}).click();
    await program.getByText("out of credit", {exact: false}).waitFor();
    await page.screenshot({path: capture});
    await program.getByRole("button", {name: "Back now", exact: true}).click();
    await program.getByText("out of credit", {exact: false}).waitFor({state: "hidden"});
    assert.equal(writes.length, 1);
    assert.deepEqual(errors, []);
} catch (error) {
    await page.screenshot({path: capture});
    throw new Error(`${error.message}\nPage errors: ${JSON.stringify(errors)}\n${(await page.locator("body").innerText()).slice(-3500)}`);
} finally {
    await browser.close();
}
