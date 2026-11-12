import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
    page.on('response', response => {if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);});
    await page.goto(`${address}#open=docs:1`);
    await page.locator('[data-document-tab="revisions"]').click();
    await page.locator('[data-text-revision="2"]').waitFor();
    assert.match(await page.locator('[data-text-revision="2"]').textContent(), /Revision 2:.*Main agent.*2026/);
    for (const colorScheme of ['light', 'dark']) {
        await page.emulateMedia({colorScheme});
        await page.screenshot({path: `${capture}-${colorScheme}.png`, animations: 'disabled'});
    }
    await page.locator('[data-close-revision]').click();
    await page.locator('[data-close-revision]').waitFor({state: 'hidden'});
} finally {
    await browser.close();
}
