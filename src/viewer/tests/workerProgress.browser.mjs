import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, worker, time, count, pace, capture] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.addInitScript((now) => { Date.now = () => now; }, Date.parse(time));
    await page.goto(address);
    const target = new URL(page.url());
    target.searchParams.set("page", "agents.agents");
    await page.goto(target.href);
    const card = page.locator(`[data-agent-open="${worker}"]`);
    await card.waitFor();
    await page.locator(".window-cover").waitFor({state: "detached"});
    if (pace) await card.locator("[data-agent-list-pace]").waitFor();
    if (pace) assert.equal((await card.locator("[data-agent-list-pace]").textContent()).trim(), pace);
    else assert.equal(await card.locator("[data-agent-list-pace]").count(), 0);
    await card.click();
    await card.locator("[data-agent-command]").waitFor();
    assert.equal(await card.locator("[data-agent-job], [data-agent-tasks], [data-agent-blocked-tasks]").count(), 0);
    await card.screenshot({path: `/tmp/journal-worker-progress-461-${capture}.png`});
} finally {
    await browser.close();
}
