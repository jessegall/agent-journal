import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, worker, reason] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.goto(address);
    const target = new URL(page.url());
    target.searchParams.set("page", "agents.agents");
    await page.goto(target.href);
    const card = page.locator(`[data-agent-open="${worker}"]`);
    await card.locator("[data-agent-waiting]").waitFor();
    await page.locator(".window-cover").waitFor({state: "detached"});
    assert.equal((await card.locator("[data-agent-waiting]").textContent()).trim(), `Waiting: ${reason}`);
    assert.equal(await card.locator(".agent-dot").getAttribute("data-state"), "waiting");
    await card.screenshot({path: `/tmp/journal-worker-wait-461-${reason.split(" ").at(-1)}.png`});
} finally {
    await browser.close();
}
