import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 900}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const link = new URL(address);
    link.searchParams.set("page", "tasks.tasks");
    await page.goto(link.href);
    await page.evaluate(() => { location.hash = "#?open=plans:1"; });
    await page.locator("[data-plan-links] > button").click();
    const section = page.locator("[data-plan-inspector] [data-resource-links]");
    try {
        await section.locator("[data-plan-link]").first().waitFor({timeout: 8000});
    } catch (error) {
        await page.screenshot({path: capture});
        throw new Error(`${error.message}\nPage errors: ${JSON.stringify(errors)}\n${(await page.locator("body").innerText()).slice(0, 1500)}`);
    }
    await page.locator("[data-resource-panel]:not(.opening)").waitFor();
    const more = section.locator("[data-page-more]");
    const signature = () => page.evaluate(() => [...document.querySelectorAll("[data-link-kind]")].map((node) => node.textContent).join("|"));
    while (await more.count()) {
        const before = await signature();
        await more.click();
        await page.waitForFunction((was) => !document.querySelector("[data-page-more]") || [...document.querySelectorAll("[data-link-kind]")].map((node) => node.textContent).join("|") !== was, before, {timeout: 5000});
    }
    const kinds = (await section.locator("[data-link-kind]").allInnerTexts()).map((text) => text.replace(/\s+/g, " ").trim());
    assert.deepEqual(kinds, ["Task 70", "Message 30"]);
    const height = (await section.boundingBox()).height;
    assert.ok(height <= 280, `the linked section stays compact, it is ${height}px`);
    assert.ok(await section.locator("[data-plan-link]").count() <= 6, "only a few rows per kind show at first");
    await page.screenshot({path: capture});
    await section.locator("[data-link-show-more]").first().click();
    assert.ok((await section.boundingBox()).height <= 280, "the section keeps its height cap after Show more");
    await page.screenshot({path: capture.replace(".png", "-expanded.png")});
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
