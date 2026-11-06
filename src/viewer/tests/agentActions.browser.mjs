import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, working, helper, retiring, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    await page.goto(`${address}&windows=agents.agents`);
    const window = page.locator('[data-window="agents.agents"]');
    const workingCard = window.locator(`[data-agent-open="${working}"]`);
    await workingCard.click();
    await workingCard.locator('[data-agent-send-message]').click();
    await workingCard.locator('[data-agent-message-text]').fill("Check the rounding before reporting.");
    await workingCard.locator('[data-agent-submit-message]').click();
    await workingCard.getByRole('status').filter({hasText: "Message sent."}).waitFor();
    await workingCard.locator('.agent-back').click();
    await window.getByRole('radio', {name: 'Idle', exact: true}).click();
    const helperCard = window.locator(`[data-agent-open="${helper}"]`);
    await helperCard.click();
    await helperCard.locator('[data-agent-send-job]').click();
    await helperCard.locator('[data-agent-job-text]').fill("Read the rounding calculation again.");
    await helperCard.locator('[data-agent-submit-job]').click();
    await helperCard.getByRole('status').filter({hasText: "Job sent."}).waitFor();
    await helperCard.locator('.agent-back').click();
    const retiringCard = window.locator(`[data-agent-open="${retiring}"]`);
    await retiringCard.click();
    await retiringCard.locator('[data-agent-retire]').click();
    const confirmation = retiringCard.locator('[data-agent-retire-confirm]');
    assert.match(await confirmation.textContent(), /Retirement is permanent/);
    assert.equal(await confirmation.locator('[data-agent-confirm-retire]').isDisabled(), true);
    await confirmation.getByRole('button', {name: 'Cancel', exact: true}).click();
    await retiringCard.locator('[data-agent-retire]').click();
    await confirmation.locator('[data-agent-retire-reason]').fill("Its question is answered");
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await window.screenshot({path: `${capture}-confirm-${colorScheme}.png`, animations: "disabled"});
    }
    await confirmation.locator('[data-agent-confirm-retire]').click();
    await window.getByRole('radio', {name: 'Retired', exact: true}).click();
    const retiredCard = window.locator(`[data-agent-open="${retiring}"]`);
    await retiredCard.click();
    await retiredCard.locator('[data-agent-retirement-reason]').waitFor();
    await retiredCard.locator('[data-agent-tab-body="transcript"]').waitFor();
    await retiredCard.locator('[aria-busy="true"]').waitFor({state: "hidden"});
    assert.deepEqual(await retiredCard.locator('[data-tab]').evaluateAll((tabs) => tabs.map((tab) => tab.dataset.tab)), ["transcript"]);
    assert.equal(await retiredCard.locator('[data-agent-actions], textarea').count(), 0);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await window.screenshot({path: `${capture}-retired-${colorScheme}.png`, animations: "disabled"});
    }
} finally {
    await browser.close();
}
