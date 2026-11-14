import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 800}});
    await page.goto(`${address}#open=memories:1`);
    const fields = page.locator("[data-resource-fields]");
    await fields.waitFor();
    const text = await fields.innerText();
    assert.match(text, /Weight/);
    assert.doesNotMatch(text, /creator|environment|_at|Keep the totals/);
    await page.waitForTimeout(500);
    for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({colorScheme});
        await page.screenshot({path: `${capture}-${colorScheme}.png`, animations: "disabled"});
    }
} finally {
    await browser.close();
}
