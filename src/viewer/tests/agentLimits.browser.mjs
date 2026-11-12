import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    page.on("pageerror", (error) => console.error(error));
    await page.goto(address);
    await page.locator('[data-open-agent-settings]').click();
    await page.locator('[data-agent-settings]').getByRole('tab', {name: 'Helpers', exact: true}).click();
    const limits = page.locator('[data-agent-settings-agents]');
    await limits.locator('[data-agent-limit-type="worker"]').waitFor({timeout: 10000});
    assert.match(await limits.locator('[data-agent-limit-type="worker"]').textContent(), /0 of 1.*1/);
    assert.match(await limits.locator('[data-agent-limit-profile="journal-researcher"]').textContent(), /0 of 2.*1 of 3/);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await limits.screenshot({path: `${capture}-${colorScheme}.png`, animations: "disabled"});
    }
    assert.equal(await limits.locator('[data-agent-limits-edit]').count(), 0);
    await limits.locator('[data-agent-limit-type="worker"]').click();
    const worker = limits.locator('[data-edit-type="worker"]');
    await worker.locator('[data-agent-limit-input="run"]').fill("2");
    await worker.locator('[data-agent-limit-input="run"]').press("Tab");
    await page.waitForFunction(() => document.querySelector('[data-edit-type="worker"] [data-agent-limit-input="run"]')?.value === "2");
    await worker.locator('[data-agent-limit-input="kept"]').fill("7");
    await worker.locator('[data-agent-limit-input="kept"]').press("Tab");
    await page.waitForFunction(() => document.querySelector('[data-edit-type="worker"] [data-agent-limit-input="kept"]')?.value === "7");
} finally {
    await browser.close();
}
