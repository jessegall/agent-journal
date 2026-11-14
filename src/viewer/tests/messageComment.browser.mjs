import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const COMMENT = "Check the cart totals too";
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
let releaseComment;
const commentReleased = new Promise((resolve) => (releaseComment = resolve));
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let commentRequested;
    const requested = new Promise((resolve) => (commentRequested = resolve));
    await page.route("**/api/line", async (route) => {
        const line = route.request().postDataJSON().line;
        if (line?.[0] !== "message" || line[1] !== "comment") return route.continue();
        commentRequested();
        await commentReleased;
        await route.continue();
    });
    await page.goto(address);
    const source = page.locator("[data-message-between-agents]", {hasText: "Check 138 failed"});
    await source.hover();
    await source.getByRole("button", {name: "Comment on this message"}).click();
    await page.locator(".composer-input").fill(COMMENT);
    await page.locator("[data-send]").click();
    await requested;
    const cards = page.locator("[data-message]", {hasText: COMMENT});
    assert.equal(await cards.count(), 1, "a pending comment appears once");
    assert.equal(await cards.locator("[data-message-comment]").count(), 1, "a pending comment uses its comment card");
    const response = page.waitForResponse((answer) => answer.url().endsWith("/api/line") && answer.request().postDataJSON().line?.[1] === "comment");
    releaseComment();
    await response;
    await page.waitForFunction((text) => [...document.querySelectorAll("[data-message]")].some((row) => row.textContent.includes(text) && !row.dataset.ref.includes("sending-")), COMMENT);
    assert.equal(await cards.count(), 1, "the saved comment replaces its pending card");
    assert.equal(await cards.locator("[data-message-comment]").count(), 1, "only the comment card remains");
    await page.screenshot({path: capture});
    assert.deepEqual(errors, []);
} finally {
    releaseComment();
    await browser.close();
}
