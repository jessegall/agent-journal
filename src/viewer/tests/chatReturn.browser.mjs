import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const windowReads = [];
    const chatLines = [];
    page.on("request", (request) => {
        if (request.headers()["x-journal-window"] === "messages.chat") windowReads.push(request.headers()["x-journal-data-only"] ?? "on screen");
        if (request.url().includes("/api/line") && request.postData()?.includes("messages.chat")) chatLines.push(request.postData());
    });
    await page.goto(address);
    const history = page.locator(".history");
    await history.getByText("Backlog message 120", {exact: true}).waitFor();
    assert.equal(await history.locator("[data-message]").count(), 50);
    await page.waitForLoadState("networkidle");
    assert.deepEqual(windowReads.slice(0, 2), ["on screen", "tool"], "the chat's first load is one request and the read that waits for it");
    assert.deepEqual(chatLines, [], "the chat reads no line of its own");
    await history.evaluate((element) => {element.scrollTop = 0; element.dispatchEvent(new Event("scroll"));});
    await page.waitForFunction(() => document.querySelectorAll(".history [data-message]").length >= 100);
    const reads = [];
    page.on("request", (request) => {
        if (request.url().includes("/api/window?")) reads.push(request.headers()["x-journal-data-only"]);
    });
    await page.evaluate(() => {
        Object.defineProperty(document, "hidden", {configurable: true, value: true});
        document.dispatchEvent(new Event("visibilitychange"));
    });
    const answer = await page.evaluate(async () => {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "messages.chat", environment: "main", line: ["message", "send", "Backlog message 121", "--environment", "main"]})});
        return response.json();
    });
    assert.equal(answer.code, 0, JSON.stringify(answer));
    await page.evaluate(() => {
        Object.defineProperty(document, "hidden", {configurable: true, value: false});
        document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForFunction(() => {
        const history = document.querySelector(".history");
        return history.querySelectorAll("[data-message]").length === 50 && history.textContent.includes("Backlog message 121") && history.scrollHeight - history.scrollTop - history.clientHeight < 2;
    });
    assert.equal(await history.locator('[data-row][style*="opacity"], [data-row][style*="display: none"]').count(), 0);
    assert.ok(reads.some((keys) => keys?.split(",").includes("messages")), JSON.stringify(reads));
    await page.screenshot({path: capture, fullPage: true});
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
