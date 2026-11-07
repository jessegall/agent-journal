import assert from "node:assert/strict";
import {chromium} from "playwright-core";

// run by a story that opens a row with links in the shared inspector layout, which mounts InspectorLinks
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
    const body = page.locator("[data-inspector-links-body]");
    await body.locator("[data-inspector-link]").first().waitFor({timeout: 8000});
    await page.locator("[data-resource-panel]:not(.opening)").waitFor();

    const box = await body.boundingBox();
    assert.equal(Math.round(box.height), 280, `open, the section is 280px high, it is ${box.height}px`);

    const tabs = page.locator("[data-inspector-links-body] [role='radiogroup'], [data-inspector-links-body] [data-segmented]").first();
    const tabsBefore = (await tabs.boundingBox()).y;
    await body.locator(".rows").evaluate((rows) => rows.scrollTo(0, rows.scrollHeight));
    assert.equal((await tabs.boundingBox()).y, tabsBefore, "the tabs stay where they are while the rows scroll");

    const panel = await page.locator("[data-resource-panel] .body, [data-inspector-body]").first().boundingBox();
    const row = await body.locator("[data-inspector-link]").first().boundingBox();
    assert.ok(row.x - panel.x >= 16, `rows are padded like the body, they start ${row.x - panel.x}px in`);
    const border = await body.locator("[data-inspector-link]").first().evaluate((element) => getComputedStyle(element).borderBottomWidth);
    assert.equal(border, "0px", "a row has no full-width line");
    await page.screenshot({path: capture});
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
