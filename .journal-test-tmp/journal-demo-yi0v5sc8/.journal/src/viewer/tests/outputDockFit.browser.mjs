import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 620}});
    await page.goto(address);
    await page.locator("[data-dock-fold]").click();
    await page.locator("[data-output-terminal]").filter({hasText: "line 399 of the run"}).waitFor();
    await page.waitForFunction(() => document.querySelector(".output-dock-more").getAnimations().length === 0);
    const edges = await page.evaluate(() => {
        const foot = document.querySelector("[data-figure-chat-foot]");
        const box = document.querySelector("[data-output-terminal]");
        return {card: document.querySelector("[data-output-dock]").getBoundingClientRect().bottom, foot: foot.getBoundingClientRect().bottom,
                footHidden: foot.scrollHeight - foot.clientHeight, chat: document.querySelector(".chat").clientHeight, terminal: box.clientHeight,
                ended: box.scrollTop + box.clientHeight >= box.scrollHeight - 1};
    });
    assert.ok(edges.card <= edges.foot + 1 && edges.footHidden <= 1, JSON.stringify(edges));
    assert.ok(edges.ended, "the terminal does not show the last line");
} finally {
    await browser.close();
}
