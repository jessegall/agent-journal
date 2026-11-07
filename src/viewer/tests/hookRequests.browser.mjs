import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    page.on("pageerror", (error) => process.stderr.write(`${error.stack}\n`));
    page.on("console", (message) => { if (message.type() === "error") process.stderr.write(`${message.text()}\n`); });
    page.on("response", (response) => { if (response.status() >= 400) process.stderr.write(`${response.status()} ${response.url()}\n`); });
    await page.goto(address);
    const target = new URL(page.url());
    target.searchParams.set("page", "developer.hook-requests");
    await page.goto(target.href);
    try {
        await page.waitForSelector('[data-hook-request="70"]', {timeout: 10000});
    } catch (error) {
        process.stderr.write(`${page.url()}\n${(await page.locator("body").innerText()).slice(0, 2500)}\n`);
        await page.screenshot({path: "/tmp/journal-hook-requests-461-failure.png"});
        throw error;
    }
    await page.locator('[data-feed-pause]').click();
    await page.screenshot({path: '/tmp/pictures-request-filter/paused.png'});
    await page.locator('[data-filter-open]').click();
    await page.screenshot({path: '/tmp/pictures-request-filter/filters.png'});
    await page.keyboard.press('Escape');
    await page.locator('[data-feed-pause]').click();
    await page.locator("[data-request-queue-open]").click();
    await page.locator("[data-request-queue]").waitFor();
    await page.getByText("No waiting requests.").waitFor();
    await page.screenshot({path: "/tmp/journal-request-queue-647.png"});
    await page.getByRole("button", {name: "Close the request queue"}).click();
    assert.deepEqual(await page.locator("[data-hook-column]").allTextContents(), ["Event", "Tool", "Parts", "Time", "Sender", "Queued", "Duration"]);
    assert.equal(await page.locator('[data-hook-request="70"] [data-hook-parts]').textContent(), "3");
    assert.equal(await page.locator('[data-hook-request="70"] [data-hook-parts]').evaluate((cell) => getComputedStyle(cell).paddingRight), "12px");
    assert.equal(await page.locator('[data-hook-request="69"] [data-hook-parts]').textContent(), "");
    assert.match(await page.locator('[data-fold="developer"]').textContent(), /Developer/);
    assert.equal(await page.locator('[data-sidebar-window="developer.hook-requests"]').count(), 1);
    assert.equal(await page.locator("[data-hook-request-detail]").count(), 0);
    assert.equal(await page.locator("[data-hook-request-divider]").count(), 1);
    assert.match(await page.locator('[data-hook-request="70"] time').textContent(), /^\d{2}:\d{2}:\d{2}\.\d{3}$/);
    assert.match(await page.locator("[data-hook-day]").first().textContent(), /\d{4}-\d{2}-\d{2}.*UTC/);
    const bounds = await page.locator("[data-hook-request-list]").evaluate((list) => ({
        scrollHeight: list.scrollHeight, height: list.clientHeight, bottom: list.getBoundingClientRect().bottom,
        pageHeight: document.documentElement.clientHeight, documentHeight: document.documentElement.scrollHeight,
        overflow: getComputedStyle(list).overflowY,
    }));
    assert.ok(bounds.scrollHeight > bounds.height, "the requests need their own scroll area");
    assert.equal(bounds.overflow, "auto");
    assert.ok(bounds.bottom <= bounds.pageHeight, "the list must end inside the viewport");
    assert.ok(bounds.documentHeight <= bounds.pageHeight, "the list must not grow the page");
    assert.equal(await page.locator('[data-hook-request="69"] .duration').evaluate((cell) => getComputedStyle(cell).color), "rgb(197, 139, 53)");
    assert.equal(await page.locator('[data-hook-request="70"] .duration').evaluate((cell) => getComputedStyle(cell).color), "rgb(215, 107, 107)");
    await page.locator('[data-hook-request="70"]').click();
    assert.match(await page.locator("[data-hook-request-headers]").textContent(), /request-69/);
    assert.match(await page.locator("[data-hook-request-body]").textContent(), /pre_tool_use/);
    await page.locator("[data-hook-request-list]").evaluate((list) => { list.scrollTop = list.scrollHeight; });
    assert.ok(await page.locator("[data-hook-request-list]").evaluate((list) => list.scrollTop > 0));
    assert.equal(await page.locator("[data-hook-request-detail-area]").evaluate((detail) => detail.scrollTop), 0);
    const divider = await page.locator("[data-hook-request-divider]").boundingBox();
    assert.equal(divider.width, 1);
    assert.ok(divider.height > 500);
    await page.locator("[data-hook-request-list]").evaluate((list) => { list.scrollTop = 0; });
    await page.screenshot({path: "/tmp/journal-hook-requests-461.png"});
    await page.setViewportSize({width: 700, height: 800});
    const narrow = await page.locator("[data-hook-request-divider]").boundingBox();
    assert.equal(narrow.height, 1);
    assert.ok(narrow.width > 100);
    assert.ok(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight));
    await page.screenshot({path: "/tmp/journal-hook-requests-461-narrow.png"});
    await page.setViewportSize({width: 1440, height: 900});
    for (const [tools, recording, visible] of [["on", "false", false], ["off", "true", false], ["off", "false", false], ["on", "true", true]]) {
        for (const line of [["setting", "switch", "journal.core.developer.tools", tools, "--project"],
                            ["setting", "set", "journal.core.developer.tools.hooks.request-log", recording, "--project"]]) {
            const response = await page.evaluate(async (line) => {
                const answer = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({line, window: "settings.settings", environment: "main"})});
                return answer.json();
            }, line);
            assert.equal(response.code, 0);
        }
        await page.locator('[data-sidebar-window="developer.hook-requests"]').waitFor({state: visible ? "visible" : "detached"});
        await page.locator('[data-sidebar-window="developer.numbers"]').waitFor({state: tools === "on" ? "visible" : "detached"});
    }
} finally {
    await browser.close();
}
