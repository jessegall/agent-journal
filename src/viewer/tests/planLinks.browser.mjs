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
    await page.locator("[data-inspector-links-head]").click();
    const section = page.locator("[data-inspector-links-body]");
    const rows = section.locator("[data-inspector-link]");
    try {
        await rows.first().waitFor({timeout: 8000});
    } catch (error) {
        await page.screenshot({path: capture});
        throw new Error(`${error.message}\nPage errors: ${JSON.stringify(errors)}\n${(await page.locator("body").innerText()).slice(0, 1500)}`);
    }
    await page.locator("[data-resource-panel]:not(.opening)").waitFor();
    assert.ok(await rows.count() <= 10, "only one page of rows shows at first");
    assert.ok((await section.boundingBox()).height <= 280, "the linked section stays compact");
    await page.screenshot({path: capture});
    const more = section.locator("[data-page-more]");
    while (await more.count()) {
        const before = await rows.count();
        await more.click();
        await page.waitForFunction((was) => document.querySelectorAll("[data-inspector-links-body] [data-inspector-link]").length > was, before, {timeout: 5000});
    }
    assert.equal(await rows.count(), 100);
    assert.ok((await section.boundingBox()).height <= 280, "the section keeps its height cap after every page is shown");
    await page.screenshot({path: capture.replace(".png", "-expanded.png")});
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
