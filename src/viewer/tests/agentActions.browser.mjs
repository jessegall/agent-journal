import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, helper, retired, capture] = process.argv.slice(2);
const BUTTONS = '[data-agent-send-job], [data-agent-retire], [data-agent-driver], [data-agent-history], [data-agent-inspector], [data-helper-stop], textarea';
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    await page.goto(`${address}&windows=agents.agents`);
    const window = page.locator('[data-window="agents.agents"]');
    await window.getByRole('radio', {name: 'Idle', exact: true}).click();
    const helperCard = window.locator(`[data-agent-open="${helper}"]`);
    await helperCard.click();
    await helperCard.locator('[data-agent-tab-body]').waitFor();
    assert.equal(await helperCard.locator(BUTTONS).count(), 0);
    const tabs = await helperCard.locator('[data-tab]').evaluateAll((items) => items.map((tab) => tab.dataset.tab));
    assert.ok(tabs.length > 3);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await window.screenshot({path: `${capture}-idle-${colorScheme}.png`, animations: "disabled"});
    }
    await helperCard.locator('.agent-back').click();
    await window.getByRole('radio', {name: 'Retired', exact: true}).click();
    const retiredCard = window.locator(`[data-agent-open="${retired}"]`);
    await retiredCard.click();
    await retiredCard.locator('[data-agent-retirement-reason]').waitFor();
    await retiredCard.locator('[data-agent-tab-body]').waitFor();
    await page.waitForFunction((id) => !document.querySelector(`[data-agent-open="${id}"] [aria-busy="true"]`), retired);
    assert.equal(await retiredCard.locator(BUTTONS).count(), 0);
    assert.deepEqual(await retiredCard.locator('[data-tab]').evaluateAll((items) => items.map((tab) => tab.dataset.tab)), tabs);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await window.screenshot({path: `${capture}-retired-${colorScheme}.png`, animations: "disabled"});
    }
} finally {
    await browser.close();
}
