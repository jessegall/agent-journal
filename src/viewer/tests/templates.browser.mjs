import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 800}});
    await page.goto(`${address}&page=templates.templates`);
    await page.locator("[data-template-new]").waitFor();
    await page.locator("[data-template-new]").click();
    await page.locator('[data-field="title"]').fill("Task: bug");
    await page.locator('[data-field="brief"]').fill("What happens and what should");
    await page.locator("[data-part-text]").first().fill("What happens: {what}");
    await page.locator("[data-create-send]").click();
    const own = page.locator("[data-reader-row]", {hasText: "Task: bug"});
    await own.waitFor();
    await own.click();
    await page.locator("[data-template-edit]").waitFor();
    const published = page.locator("[data-reader-row]", {hasText: "General critique"});
    await published.click();
    await page.locator("[data-template-fixed]").waitFor();
    assert.equal(await page.locator("[data-template-edit]").count(), 0);
} finally {
    await browser.close();
}
