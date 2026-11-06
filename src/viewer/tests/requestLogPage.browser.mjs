import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    const documents = [];
    page.on("request", (request) => request.isNavigationRequest() && documents.push(request.url()));
    await page.goto(address);
    await page.locator(".composer-input").waitFor();
    const loads = documents.length;
    await page.evaluate(() => (window.keptSinceLoad = true));
    await page.locator('[data-sidebar-window="developer.hook-requests"]').click();
    await page.locator("[data-hook-requests]").waitFor();
    assert.equal(documents.length, loads, "moving to the request log loads no document");
    assert.ok(await page.evaluate(() => window.keptSinceLoad), "the page was not reloaded");
    assert.ok(page.url().includes("page=developer.hook-requests"), "the address follows");
    await page.goBack();
    await page.locator(".composer-input").waitFor();
    assert.ok(await page.evaluate(() => window.keptSinceLoad), "the back button reloads nothing");
} finally {
    await browser.close();
}
