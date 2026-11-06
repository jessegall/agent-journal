import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 720}, reducedMotion: "reduce"});
    await page.goto(address);
    const history = page.locator(".history");
    await history.getByText("Scroll message 30", {exact: true}).waitFor();
    for (const title of ["First dock", "Second dock"]) {
        const answer = await page.evaluate(async (name) => {
            const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "documents.documents", environment: "main", line: ["doc", "make", name, "--abstract", "A new card", "--body", "Details", "--environment", "main"]})});
            return response.json();
        }, title);
        assert.equal(answer.code, 0, JSON.stringify(answer));
        await page.locator(".chat-dock-card").filter({hasText: title}).waitFor();
    }
    await page.waitForTimeout(1000);
    await history.evaluate((element) => { element.scrollTop = element.scrollHeight / 3; });
    const before = await history.evaluate((element) => element.scrollTop);
    await page.waitForTimeout(3400);
    const cards = page.locator(".chat-dock.collapsed");
    assert.equal(await cards.count(), 2);
    assert.ok(Math.abs((await history.evaluate((element) => element.scrollTop)) - before) < 2);
    for (const card of await cards.all()) {
        assert.equal(await card.locator(".chat-dock-foot").isVisible(), false);
        assert.equal(await card.locator("[data-dock-age]").isVisible(), true);
    }
    await page.screenshot({path: `${capture}-collapsed.png`, animations: "disabled"});
    await history.evaluate((element) => { element.scrollTop = element.scrollHeight; });
    await page.waitForFunction(() => document.querySelectorAll(".chat-dock.collapsed").length === 0);
    await page.screenshot({path: `${capture}-open.png`, animations: "disabled"});
} finally {
    await browser.close();
}
