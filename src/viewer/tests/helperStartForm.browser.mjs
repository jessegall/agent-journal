import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, helper, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    await page.goto(`${address}&windows=profiles.profiles`);
    await page.locator('[data-profile="journal-researcher"]').click();
    const form = page.locator("[data-helper-start]");
    const send = form.locator(`[data-helper-send="${helper}"]`);
    await send.waitFor();
    await form.locator("[data-helper-brief]").fill("Read src/tax.py and report what can be simplified.");
    assert.equal(await form.locator("[data-helper-start-button]").isDisabled(), true);
    assert.equal(await send.isEnabled(), true);
    await form.locator("[data-helper-fresh-reason]").fill("An independent comparison");
    assert.equal(await form.locator("[data-helper-start-button]").isEnabled(), true);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await form.screenshot({path: `${capture}-${colorScheme}.png`, animations: "disabled"});
    }
    await send.click();
    await form.getByText("Job sent.", {exact: true}).waitFor();
    assert.equal(await form.locator("[data-helper-brief]").inputValue(), "");
} finally {
    await browser.close();
}
