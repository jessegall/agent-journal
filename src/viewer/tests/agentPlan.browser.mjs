import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, agent, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 900}, reducedMotion: "reduce"});
    await page.goto(`${address}&windows=agents.agents`);
    const plan = page.locator(`[data-window="agents.agents"] [data-agent-open="${agent}"] [data-agent-plan]`);
    await plan.waitFor();
    await page.locator('[data-window="agents.agents"] [aria-busy="true"]').waitFor({state: "hidden"});
    assert.match(await plan.textContent(), /plan 1/);
    await page.screenshot({path: capture, animations: "disabled"});
    await plan.click();
    await page.locator('[data-resource-title]').filter({hasText: "Release work"}).waitFor();
} finally {
    await browser.close();
}
