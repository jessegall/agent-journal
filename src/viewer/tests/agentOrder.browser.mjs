import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, ids] = process.argv.slice(2);
const helpers = ids.split(",").map(Number);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.goto(address);
    for (const [view, capture, expected] of [["agents.agents", "agents", helpers], ["agents.helpers", "helpers", helpers]]) {
        const target = new URL(page.url());
        target.searchParams.set("page", view);
        await page.goto(target.href);
        await page.locator(".agents").getByRole("radio", {name: "All", exact: true}).click();
        await page.locator(".window-cover").waitFor({state: "detached"});
        await page.waitForFunction((count) => document.querySelectorAll("[data-agent-row]").length === count, expected.length);
        assert.deepEqual(await page.locator("[data-agent-row]").evaluateAll((rows) => rows.map((row) => Number(row.dataset.agentRow))), expected);
        await page.locator("[data-agent-row]").last().waitFor({state: "visible"});
        await page.screenshot({path: `/tmp/journal-agent-order-461-${capture}.png`});
    }
} finally {
    await browser.close();
}
