import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, worker, helper, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 960}, reducedMotion: "reduce"});
    await page.goto(`${address}&windows=agents.agents`);
    const window = page.locator('[data-window="agents.agents"]');
    for (const [id, memories] of [[worker, 3], [helper, 1]]) {
        const card = window.locator(`[data-agent-open="${id}"]`);
        await card.waitFor();
        await card.click();
        await card.locator("[data-information-bar]").waitFor();
        assert.equal(await card.locator("[data-agent-head-actions]").count(), 1, "the buttons sit in the title bar");
        assert.equal(await card.locator("[data-information-bar] [data-fact='model']").count(), 0, "the model shows once, among the lasting facts");
        const tab = card.locator('[data-tab="memories"]');
        assert.match(await tab.textContent(), new RegExp(`Memories\\s*${memories}`));
        await tab.click();
        await card.locator("[data-agent-memories-active]").waitFor();
        assert.equal(await card.locator("[data-agent-memories] [data-memory]").count(), memories);
        assert.match(await card.locator("[data-memory-state]").first().textContent(), /State: Active/);
        assert.match(await card.locator("[data-memory-weight]").first().textContent(), /Weight: \d+ of 10/);
        assert.equal(await card.getByText("Kept").count(), 0);
        await page.screenshot({path: `${capture}-${id}.png`, fullPage: true, animations: "disabled"});
        if (id === worker) {
            await card.locator("[data-agent-memories-removed] button").click();
            await card.getByText("Reason: The branch was renamed").waitFor();
            await page.screenshot({path: `${capture}-removed-${id}.png`, fullPage: true, animations: "disabled"});
        }
        await card.getByRole("button", {name: "Back", exact: true}).click();
    }
} finally {
    await browser.close();
}
