import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    await page.goto(address);
    const card = page.locator('.chat-dock-card[aria-label="Project"]');
    const fold = card.locator("[data-dock-fold]");
    await fold.waitFor({state: "visible"});
    if (await fold.getAttribute("aria-expanded") === "false") await fold.click();
    await fold.click();
    assert.equal(await fold.getAttribute("aria-expanded"), "false");
    const answer = await page.evaluate(async () => {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "documents.documents", environment: "main", line: ["doc", "make", "Another document", "--abstract", "New context", "--body", "New notes", "--environment", "main"]})});
        return response.json();
    });
    assert.equal(answer.code, 0, JSON.stringify(answer));
    await page.locator('.chat-dock-card[aria-label="Another document"]').waitFor({state: "visible"});
    assert.equal(await fold.getAttribute("aria-expanded"), "false");
    await page.reload();
    await fold.waitFor({state: "visible"});
    assert.equal(await fold.getAttribute("aria-expanded"), "false");
    await card.screenshot({path: capture});
    await fold.click();
    assert.equal(await fold.getAttribute("aria-expanded"), "true");
    await page.reload();
    await fold.waitFor({state: "visible"});
    assert.equal(await fold.getAttribute("aria-expanded"), "true");
} finally {
    await browser.close();
}
