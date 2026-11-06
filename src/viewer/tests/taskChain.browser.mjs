import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, shot] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    const link = new URL(address);
    link.searchParams.set("page", "tasks.tasks");
    await page.goto(link.href);
    await page.evaluate(() => { location.hash = "#?open=tasks:3"; });
    const chain = page.locator("[data-task-chain]");
    await chain.waitFor({timeout: 10000}).catch(async (error) => {
        await page.screenshot({path: `${shot}-failed.png`});
        throw new Error(`${error.message}\n${await page.locator("body").innerText()}`);
    });
    await page.locator("[data-resource-panel]").evaluate((element) => Promise.all(element.getAnimations({subtree: true}).map((animation) => animation.finished)));
    const numbers = () => chain.locator(".task-chain-link .number").allTextContents();
    assert.deepEqual(await numbers(), ["4", "3", "2"]);
    assert.equal(await chain.locator("h4").textContent(), "What waits on what");
    assert.equal(await chain.locator(".task-chain-link.current .word").textContent(), "This task");
    assert.equal(await chain.locator("[data-task-chain-more]").textContent(), "Show the whole chain (2 more)");
    await chain.locator("[data-task-chain-more]").click();
    assert.deepEqual(await numbers(), ["5", "4", "3", "2", "1"]);
    await page.screenshot({path: `${shot}.png`});
    await chain.locator(".task-chain-link").nth(3).click();
    await page.locator("[data-task-inspector] [data-resource-title]", {hasText: "Task two"}).waitFor();
} finally {
    await browser.close();
}
