import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(address);
    const one = page.locator("[data-message]", {hasText: "One link here"});
    const four = page.locator("[data-message]", {hasText: "Four links here"});
    await one.locator("[data-message-links-rows]").waitFor();
    await four.locator("[data-message-links-count]").waitFor();
    const oneFoot = await one.locator(".message-foot").boundingBox();
    const oneLinks = await one.locator("[data-message-links]").boundingBox();
    assert.ok(oneLinks.y >= oneFoot.y + oneFoot.height - 1, "the link line sits below the number and the time");
    assert.ok(await one.locator(".message-dot").isVisible());
    assert.equal(await one.locator("[data-message-links-count]").count(), 0);
    assert.match(await one.locator("[data-message-links-rows]").innerText(), /^Linked: task\s+1$/);
    const oneRow = await page.locator(".history .row-list-row", {hasText: "One link here"}).boundingBox();
    const fourRow = await page.locator(".history .row-list-row", {hasText: "Four links here"}).boundingBox();
    assert.ok(Math.abs(fourRow.y - (oneRow.y + oneRow.height) - 10) < 1, "two items sit 10 pixels apart, as in version 4");
    const padding = await page.locator(".history .row-list").evaluate((list) => [getComputedStyle(list).paddingTop, getComputedStyle(list).paddingBottom]);
    assert.deepEqual(padding, ["18px", "20px"]);
    assert.equal(await four.locator("[data-message-links-rows]").isVisible(), false);
    assert.match(await four.locator("[data-message-links-count]").innerText(), /4 linked tasks/);
    const paragraph = await page.locator(".message-card p", {hasText: "several lines"}).evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const lines = [...range.getClientRects()].map((line) => line.width).filter((width) => width > 20);
        return {wrap: getComputedStyle(element).textWrap, widest: Math.max(...lines), narrowest: Math.min(...lines), count: lines.length};
    });
    assert.ok(paragraph.count > 1 && paragraph.narrowest > paragraph.widest * 0.7, JSON.stringify(paragraph));
    await page.screenshot({path: capture});
    await four.locator("[data-message-links-count]").click();
    await four.locator("[data-message-links-list]").getByText("Task number 4").waitFor();
    await page.screenshot({path: capture.replace(".png", "-open.png")});
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
