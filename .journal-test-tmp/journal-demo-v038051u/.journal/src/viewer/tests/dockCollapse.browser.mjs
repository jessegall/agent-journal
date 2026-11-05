import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    await page.goto(address);
    const card = page.locator('.chat-dock-card[aria-label="Project"]');
    const fold = card.locator("[data-dock-fold]");
    await card.waitFor({state: "visible"});
    assert.equal(await fold.count(), 0);
    const answer = await page.evaluate(async () => {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "documents.documents", environment: "main", line: ["doc", "make", "Another document", "--abstract", "New context", "--body", "New notes", "--environment", "main"]})});
        return response.json();
    });
    assert.equal(answer.code, 0, JSON.stringify(answer));
    await page.locator('.chat-dock-card[aria-label="Another document"]').waitFor({state: "visible"});
    assert.equal(await fold.count(), 0);
    await page.reload();
    await card.waitFor({state: "visible"});
    assert.equal(await fold.count(), 0);
    await card.screenshot({path: capture});
    await card.getByRole("button", {name: "Open", exact: true}).click();
    await page.getByText("Keep the project notes here.", {exact: true}).waitFor();
} finally {
    await browser.close();
}
