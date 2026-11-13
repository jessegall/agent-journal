import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, worker, task, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    await page.goto(`${address}&windows=agents.agents`);
    const window = page.locator('[data-window="agents.agents"]');
    await window.getByRole('radio', {name: 'Idle', exact: true}).click();
    const card = window.locator(`[data-agent-open="${worker}"]`);
    await card.click();
    await card.locator('[data-agent-menu]').click();
    await card.locator('[data-agent-send-job]').click();
    await card.locator('[data-agent-job-task]').selectOption(task);
    assert.equal(await card.locator('[data-agent-job-text]').count(), 0);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await window.screenshot({path: `${capture}-${colorScheme}.png`, animations: "disabled"});
    }
    await card.locator('[data-agent-submit-job]').click();
    await card.getByRole('status').filter({hasText: "Job sent."}).waitFor();
} finally {
    await browser.close();
}
