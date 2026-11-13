import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, worker, helper, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 960}, reducedMotion: "reduce"});
    await page.goto(`${address}&windows=agents.agents`);
    const window = page.locator('[data-window="agents.agents"]');
    for (const [id, command, other] of [[worker, "ls worker-files", "ls helper-files"], [helper, "ls helper-files", "ls worker-files"]]) {
        const card = window.locator(`[data-agent-open="${id}"]`);
        await card.waitFor();
        await card.locator('[data-agent-status][aria-label*="Seen:"]').waitFor({timeout: 5000});
        await window.locator('[aria-busy="true"]').waitFor({state: "hidden"});
        await page.screenshot({path: `${capture}-last-heard-${id}.png`, fullPage: true, animations: "disabled"});
        await card.click();
        await card.locator("[data-information-bar]").waitFor();
        await page.screenshot({path: `${capture}-band-${id}.png`, fullPage: true, animations: "disabled"});
        await card.locator('[data-tab="terminal"]').click();
        await card.getByText(command, {exact: true}).waitFor();
        assert.equal(await card.getByText(other, {exact: true}).count(), 0);
        await page.screenshot({path: `${capture}-${id}.png`, fullPage: true, animations: "disabled"});
        await card.getByRole("button", {name: "Back", exact: true}).click();
    }
} finally {
    await browser.close();
}
