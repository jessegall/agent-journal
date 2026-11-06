import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, worker, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1000, height: 960}, reducedMotion: "reduce"});
    await page.goto(`${address}&windows=agents.agents`);
    const window = page.locator('[data-window="agents.agents"]');
    await window.locator(`[data-agent-open="${worker}"]`).waitFor();
    await window.locator("[data-search-menu]").click();
    await page.locator('[data-filter-role="worker"]').click();
    await page.locator('[data-filter-program="codex"]').click();
    await page.waitForFunction(() => document.querySelector("[data-menu-count]")?.textContent === "2");
    await page.waitForFunction(() => document.querySelectorAll('[data-window="agents.agents"] [data-agent-open]').length === 1);
    assert.equal(await window.locator('[data-agent-open]').count(), 1);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await page.screenshot({path: `${capture}-${colorScheme}.png`, animations: "disabled"});
    }
} finally {
    await browser.close();
}
