import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.goto(address);
    const target = new URL(page.url());
    target.searchParams.set("page", "tasks.tasks");
    await page.goto(target.href);
    await page.locator("[data-manage-tasks]").click();
    const dialog = page.locator("[data-tasks-dialog]");
    await dialog.locator(".tasks-tools").waitFor();
    await page.locator(".dialog-panel").evaluate((panel) => Promise.all(panel.getAnimations().map((animation) => animation.finished)));
    const list = await dialog.locator(".tasks-list").boundingBox();
    const search = await dialog.locator(".tasks-tools").boundingBox();
    const body = await dialog.locator(".tasks-body").boundingBox();
    assert.equal(search.x, list.x, "the search bar must reach the list's left edge");
    assert.equal(search.x + search.width, list.x + list.width, "the search bar must reach the list's right edge");
    assert.equal(search.y, list.y, "the host must add no padding above the search bar");
    assert.equal(list.x, body.x);
    assert.equal(list.width, body.width);
    assert.equal(await dialog.locator(".tasks-list").evaluate((element) => getComputedStyle(element).padding), "0px");
    await page.screenshot({path: "/tmp/journal-tasks-dialog-461.png"});
} finally {
    await browser.close();
}
