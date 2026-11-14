import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const RUN = "journal.suites.coding.workers.worker-run-limit";
const KEPT = "journal.suites.coding.workers.worker-kept-limit";
const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    page.on("pageerror", (error) => console.error(error));
    await page.goto(address);
    await page.locator('[data-open-agent-settings]').click();
    await page.locator('[data-agent-settings]').getByRole('tab', {name: /^Helpers/}).click();
    const limits = page.locator('[data-agent-settings-agents]');
    await limits.locator('[data-type-row="worker"]').waitFor({timeout: 10000});
    assert.match(await limits.locator('[data-type-row="worker"]').textContent(), /0 of 1.*1/);
    assert.match(await limits.locator('[data-type-row="helper:journal-researcher"]').textContent(), /0 of 2.*1 of 3/);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await limits.screenshot({path: `${capture}-${colorScheme}.png`, animations: "disabled"});
    }
    assert.equal(await limits.locator('[data-agent-limits-edit]').count(), 0);
    await limits.locator('[data-type-row="worker"]').click();
    await limits.locator(`[data-setting="${RUN}"] input`).fill("2");
    await limits.locator(`[data-setting="${KEPT}"] input`).fill("7");
    const note = page.locator('[data-settings-note]');
    await page.waitForFunction(() => /^2 changes/.test(document.querySelector('[data-settings-note]')?.textContent ?? ""), null, {timeout: 10000});
    await page.locator('[data-settings-apply]').click();
    await page.waitForFunction(() => /^No changes/.test(document.querySelector('[data-settings-note]')?.textContent ?? ""), null, {timeout: 10000});
    assert.match(await note.textContent(), /^No changes/);
    assert.equal(await limits.locator(`[data-setting="${RUN}"] input`).inputValue(), "2");
    assert.equal(await limits.locator(`[data-setting="${KEPT}"] input`).inputValue(), "7");
} finally {
    await browser.close();
}
