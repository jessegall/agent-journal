import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, helper, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    page.on("pageerror", (error) => console.error(error));
    page.on("console", (message) => { if (message.type() === "error") console.error(message.text()); });
    await page.goto(`${address}&windows=agents.agents`);
    const window = page.locator('[data-window="agents.agents"]');
    try {
        await window.locator('[data-agent-open]').first().waitFor();
    } catch (error) {
        console.error(await page.locator('body').innerText());
        throw error;
    }
    assert.deepEqual((await window.locator('.segmented button').allTextContents()).map((text) => text.trim()), ["Working", "Idle", "Retired", "All"]);
    await window.getByRole('radio', {name: 'Idle', exact: true}).click();
    await window.locator(`[data-agent-open="${helper}"] [data-agent-job]`).waitFor();
    assert.equal(await window.locator('[data-agent-open]').count(), 2);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await window.screenshot({path: `${capture}-idle-${colorScheme}.png`, animations: "disabled"});
    }
    await window.locator(`[data-agent-open="${helper}"]`).click();
    await window.locator('[data-agent-tab-body="transcript"]').waitFor();
    await window.locator('[data-agent-resume-reason]').first().waitFor();
    await window.locator('.agent-back').click();
    await window.getByRole('radio', {name: 'Retired', exact: true}).click();
    await window.locator('[data-agents-upgrade]').waitFor();
    await page.waitForFunction(() => document.querySelectorAll('[data-window="agents.agents"] [data-agent-open]').length === 1);
    assert.equal(await window.locator('[data-agent-open]').count(), 1);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await window.screenshot({path: `${capture}-retired-${colorScheme}.png`, animations: "disabled"});
    }
    await window.locator('[data-agent-open]').first().click();
    await window.locator('[data-agent-retirement-reason]').waitFor();
    await window.locator('.agent-back').click();
    await window.getByRole('radio', {name: 'All', exact: true}).click();
    await page.waitForFunction(() => document.querySelectorAll('[data-window="agents.agents"] [data-agent-open]').length === 4);
} finally {
    await browser.close();
}
