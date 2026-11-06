import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, helper, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    await page.goto(`${address}&windows=agents.agents`);
    const window = page.locator('[data-window="agents.agents"]');
    await window.locator('[data-agent-open]').waitFor();
    assert.deepEqual(await window.locator('.segmented button').allTextContents(), ["Working", "Idle", "Retired", "All"]);
    await window.getByRole('button', {name: 'Idle', exact: true}).click();
    await window.locator(`[data-agent-open="${helper}"] [data-agent-report]`).waitFor();
    assert.equal(await window.locator('[data-agent-open]').count(), 2);
    await window.locator('[data-agent-resume-reason]').first().waitFor();
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await window.screenshot({path: `${capture}-idle-${colorScheme}.png`, animations: "disabled"});
    }
    await window.getByRole('button', {name: 'Retired', exact: true}).click();
    await window.locator('[data-agents-upgrade]').waitFor();
    await window.locator('[data-agent-retirement-reason]').waitFor();
    assert.equal(await window.locator('[data-agent-open]').count(), 1);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await window.screenshot({path: `${capture}-retired-${colorScheme}.png`, animations: "disabled"});
    }
    await window.getByRole('button', {name: 'All', exact: true}).click();
    await page.waitForFunction(() => document.querySelectorAll('[data-window="agents.agents"] [data-agent-open]').length === 4);
} finally {
    await browser.close();
}
