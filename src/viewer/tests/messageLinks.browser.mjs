import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    const errors = [];
    const requestErrors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => requestErrors.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on("response", async (response) => {
        if (response.status() >= 400) requestErrors.push(`${response.status()} ${response.url()}: ${(await response.text()).slice(0, 1200)}`);
    });
    await page.goto(address);
    const one = page.locator("[data-message]", {hasText: "One link here"});
    const four = page.locator("[data-message]", {hasText: "Four links here"});
    try {
        await one.locator("[data-message-links-rows]").waitFor();
    } catch (error) {
        throw new Error(`${error.message}\nPage errors: ${JSON.stringify(errors)}\nRequest errors: ${JSON.stringify(requestErrors)}\nChat: ${await page.locator("body").innerText()}`);
    }
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
    assert.deepEqual(padding, ["18px", "8px"]);
    assert.equal(await four.locator("[data-message-links-rows]").isVisible(), false);
    assert.match(await four.locator("[data-message-links-count]").innerText(), /4 linked tasks/);
    await page.screenshot({path: capture});
    await four.locator("[data-message-links-count]").click();
    await four.locator("[data-message-links-list]").getByText("Task number 4").waitFor();
    await four.locator("[data-message-links-count]").focus();
    await page.keyboard.press("Enter");
    assert.equal(await four.locator("[data-message-links-list]").count(), 0);
    await page.keyboard.press("Enter");
    await four.locator("[data-message-links-list]").getByText("Task number 4").waitFor();
    await page.screenshot({path: capture.replace(".png", "-open.png")});
    await page.setViewportSize({width: 390, height: 960});
    const three = page.locator("[data-message]", {hasText: "Three links here"});
    assert.ok(await three.locator("[data-message-links-count]").isVisible());
    await three.locator("[data-message-links-count]").click();
    await three.locator("[data-message-links-list]").getByText("Task number 3").waitFor();
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
