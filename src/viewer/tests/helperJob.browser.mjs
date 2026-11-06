import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, helper, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 960}, reducedMotion: "reduce"});
    await page.goto(`${address}&windows=agents.agents`);
    const job = page.locator(`[data-window="agents.agents"] [data-agent-open="${helper}"] [data-agent-job]`);
    await job.waitFor();
    await page.locator('[data-window="agents.agents"] [aria-busy="true"]').waitFor({state: "hidden"});
    assert.match(await job.textContent(), /Read src\/cart.py/);
    await page.screenshot({path: capture, fullPage: true, animations: "disabled"});
} finally {
    await browser.close();
}
