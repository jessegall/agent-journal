import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const CARDS = 6;
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 560}});
    await page.goto(address);
    await page.locator(".history").getByText("Scroll message 30", {exact: true}).waitFor();
    for (let number = 1; number <= CARDS; number++) {
        const title = `Header dock ${number}`;
        const answer = await page.evaluate(async (name) => {
            const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "documents.documents", environment: "main", line: ["doc", "make", name, "--abstract", "A new card", "--body", "Details", "--environment", "main"]})});
            return response.json();
        }, title);
        assert.equal(answer.code, 0, JSON.stringify(answer));
        await page.locator(".chat-dock-card").filter({hasText: title}).waitFor();
    }
    await page.waitForTimeout(1500);
    const foot = page.locator(".chat-foot");
    const scrollable = await foot.evaluate((element) => element.scrollHeight - element.clientHeight);
    assert.ok(scrollable > 20, `the dock does not scroll: ${scrollable} pixels to scroll`);
    const edges = () => page.evaluate(() => {
        const rect = (selector) => document.querySelector(selector).getBoundingClientRect();
        return {chatTop: rect(".chat").top, footTop: rect(".chat-foot").top, footBottom: rect(".chat-foot").bottom, headerTop: rect("[data-dock-all]").top, headerBottom: rect("[data-dock-all]").bottom, firstCardTop: rect(".chat-dock-card").top, scrolled: document.querySelector(".chat-foot").scrollTop};
    });
    const before = await edges();
    await foot.evaluate((element) => {element.scrollTop = element.scrollHeight;});
    await page.waitForTimeout(300);
    const after = await edges();
    assert.ok(after.scrolled > 20, JSON.stringify(after));
    assert.ok(after.firstCardTop < before.firstCardTop - 20, `the cards did not move: ${JSON.stringify({before, after})}`);
    assert.ok(Math.abs(after.headerTop - after.footTop) < 3, `the header left the top of the dock: ${JSON.stringify(after)}`);
    assert.ok(after.headerTop >= after.chatTop, `the header went above the chat: ${JSON.stringify(after)}`);
    assert.ok(after.headerBottom <= after.footBottom, `the header went below the dock: ${JSON.stringify(after)}`);
    assert.ok(Math.abs(before.headerTop - after.headerTop) < 2, `the header moved from ${before.headerTop} to ${after.headerTop}`);
} finally {
    await browser.close();
}
