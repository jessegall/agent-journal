import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, visible] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const tours = [];
    await page.exposeFunction("tourAppeared", () => tours.push(true));
    await page.addInitScript(() => {
        new MutationObserver(() => {
            if (document.querySelector(".pane-tour")) window.tourAppeared();
        }).observe(document, {childList: true, subtree: true});
    });
    const sessionAnswer = page.waitForResponse((answer) => new URL(answer.url()).pathname === "/api/session");
    await page.goto(address);
    const session = await (await sessionAnswer).json();
    assert.equal(session.tour_completed, visible !== "true");
    await page.waitForSelector(".pane-stage");
    await page.waitForSelector("section.window");
    if (visible === "true") {
        await page.waitForSelector(".pane-tour");
        assert.match(await page.locator(".pane-tour-title").textContent(), /Add a window/);
    } else {
        assert.equal(await page.locator(".pane-tour").count(), 0);
        assert.equal(await page.locator(".pane-menu-hint").count(), 0);
        assert.equal(tours.length, 0, "the completed tour must never flash on screen");
    }
    await page.reload();
    await page.waitForSelector(".pane-stage");
    await page.waitForSelector("section.window");
    if (visible === "true") await page.waitForSelector(".pane-tour");
    assert.equal(await page.locator(".pane-tour").count(), visible === "true" ? 1 : 0);
} finally {
    await browser.close();
}
