import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, folder, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 1000}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${address}&page=triggers.triggers`);
    await page.locator('[data-row="1"]').click();
    const dialog = page.locator(".dialog-panel");
    await dialog.locator("[data-trigger-folder]").fill(folder);
    await dialog.locator("[data-trigger-printed]").check();
    await dialog.locator('[data-trigger-match="pattern"]').click();
    assert.match(await dialog.locator("[data-trigger-pattern-limit]").innerText(), /no time limit/);
    await dialog.locator('[data-trigger-match="part"]').click();
    await dialog.locator("[data-trigger-word]").fill("--force");
    await dialog.locator("[data-trigger-word]").press("Enter");
    await dialog.locator("[data-trigger-extra-action]").scrollIntoViewIfNeeded();
    await page.screenshot({path: capture, fullPage: true});
    await dialog.locator("[data-trigger-save]").click();
    await dialog.waitFor({state: "detached"});
    await page.reload();
    await page.locator('[data-row="1"]').click();
    assert.equal(await dialog.locator("[data-trigger-folder]").inputValue(), folder);
    assert.equal(await dialog.locator("[data-trigger-printed]").isChecked(), true);
    assert.match(await dialog.innerText(), /--force/);
    await page.setViewportSize({width: 390, height: 844});
    await dialog.locator("[data-trigger-extra-action]").scrollIntoViewIfNeeded();
    assert.ok((await dialog.locator("[data-trigger-extra-action]").boundingBox()).width <= 390);
    await page.screenshot({path: capture.replace(".png", "-narrow.png"), fullPage: true});
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
