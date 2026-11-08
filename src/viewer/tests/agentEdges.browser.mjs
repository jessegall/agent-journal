import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, agent, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 900}});
    for (const width of [1000, 390]) {
        await page.setViewportSize({width, height: 900});
        await page.goto(`${address}&windows=agents.agents`);
        const window = page.locator('[data-window="agents.agents"]');
        const card = window.locator(`[data-agent-open="${agent}"]`);
        await card.waitFor();
        await card.click();
        await card.getByRole("button", {name: "Back to the list"}).waitFor();
        assert.ok(await card.locator(".agent-head").evaluate((element) => element.getAnimations().some((animation) => animation.effect.getTiming().duration === 280)));
        for (const [tab, selector] of [["transcript", ".transcript .row-list-row"], ["file-feed", ".file-feed .row-list-row"]]) {
            await card.locator(`[data-tab="${tab}"]`).click();
            const item = card.locator(selector).first();
            await item.waitFor();
            const bounds = await item.evaluate((element) => {
                const box = element.getBoundingClientRect();
                const windowBox = element.closest("[data-window]").getBoundingClientRect();
                return {left: box.left - windowBox.left, right: windowBox.right - box.right, border: getComputedStyle(element).borderBottomWidth};
            });
            assert.ok(Math.abs(bounds.left) < 3 && Math.abs(bounds.right) < 3, JSON.stringify(bounds));
            assert.equal(bounds.border, "1px");
            await card.evaluate((element) => Promise.all(element.getAnimations({subtree: true}).filter((animation) => animation.effect.getComputedTiming().iterations !== Infinity).map((animation) => animation.finished)));
            await page.screenshot({path: `${capture}-${width}-${tab}.png`, animations: "disabled"});
        }
        await card.getByRole("button", {name: "Back to the list"}).click();
        await page.waitForFunction((agent) => document.querySelector(`[data-agent-open="${agent}"]`)?.getAttribute("aria-expanded") === "false", agent);
        assert.equal(await window.locator("[data-agents-search]").count(), 1);
    }
} finally {
    await browser.close();
}
