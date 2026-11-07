import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 720}});
    await page.goto(address);
    const history = page.locator(".history");
    await history.getByText("Scroll message 30", {exact: true}).waitFor();
    await page.waitForFunction(() => {
        const history = document.querySelector(".history");
        return history.scrollHeight - history.scrollTop - history.clientHeight < 2;
    });
    const addDocument = async (title) => {
        const answer = await page.evaluate(async (name) => {
            const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "documents.documents", environment: "main", line: ["doc", "make", name, "--abstract", "A new card", "--body", "Details", "--environment", "main"]})});
            return response.json();
        }, title);
        assert.equal(answer.code, 0, JSON.stringify(answer));
        await page.locator(".chat-dock-card").filter({hasText: title}).waitFor();
        await page.waitForTimeout(1200);
    };
    await addDocument("First dock");
    const geometry = await page.evaluate(() => {
        const history = document.querySelector(".history").getBoundingClientRect();
        const dock = document.querySelector(".chat-foot").getBoundingClientRect();
        return {historyBottom: history.bottom, dockTop: dock.top};
    });
    assert.ok(geometry.historyBottom <= geometry.dockTop, JSON.stringify(geometry));
    const message = `A new message with the dock open ${Date.now()}`;
    const sent = await page.evaluate(async (text) => {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "messages.chat", environment: "main", line: ["message", "send", text, "--environment", "main"]})});
        return response.json();
    }, message);
    assert.equal(sent.code, 0, JSON.stringify(sent));
    await history.getByText(message, {exact: true}).waitFor();
    await page.waitForFunction(() => {
        const history = document.querySelector(".history");
        return history.scrollHeight - history.scrollTop - history.clientHeight < 2;
    });
    const distance = await history.evaluate((element) => element.scrollHeight - element.scrollTop - element.clientHeight);
    assert.ok(distance < 2, `chat moved ${distance} pixels from the bottom`);
    await history.evaluate((element) => {element.scrollTop = element.scrollHeight / 3;});
    await page.waitForTimeout(800);
    const before = await history.evaluate((element) => element.scrollTop);
    assert.ok(before > 0);
    await addDocument("Second dock");
    const after = await history.evaluate((element) => element.scrollTop);
    assert.ok(Math.abs(after - before) < 2, `chat moved from ${before} to ${after}`);
} finally {
    await browser.close();
}
