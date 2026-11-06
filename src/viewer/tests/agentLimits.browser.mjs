import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    page.on("pageerror", (error) => console.error(error));
    await page.goto(address);
    await page.locator('[data-work-settings]').click();
    await page.locator('[data-open-agent-limits]').click();
    const limits = page.locator('[data-window="agents.agents"] [data-agent-limits]');
    await limits.locator('.summary').click();
    try {
        await limits.locator('[data-agent-limit-type="worker"]').waitFor({timeout: 10000});
    } catch (error) {
        console.error(await page.locator('body').innerText());
        throw error;
    }
    assert.match(await limits.locator('[data-agent-limit-type="worker"]').textContent(), /0 of 1.*1 of no limit/);
    assert.match(await limits.locator('[data-agent-limit-profile="journal-researcher"]').textContent(), /0 of 2.*1 of 3/);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await limits.screenshot({path: `${capture}-${colorScheme}.png`, animations: "disabled"});
    }
    await limits.locator('[data-agent-limits-edit]').click();
    await limits.locator('[data-agent-run-limit="worker"]').fill("2");
    await limits.locator('[data-agent-run-limit="worker"]').press("Tab");
    await page.waitForFunction(() => document.querySelector('[data-agent-run-limit="worker"]')?.value === "2");
    await limits.locator('[data-agent-kept-limit="worker"]').fill("7");
    await limits.locator('[data-agent-kept-limit="worker"]').press("Tab");
    await page.waitForFunction(() => document.querySelector('[data-agent-kept-limit="worker"]')?.value === "7");
} finally {
    await browser.close();
}
