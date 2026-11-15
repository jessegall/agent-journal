import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${address}&windows=agents.agents`);
    const button = page.locator("[data-agent-bar]").getByRole("button", {name: "Process queue"});
    await button.waitFor();
    await button.click();
    await page.locator("[data-queue-controls]").waitFor();
    const note = page.locator('[data-lane="long"] [data-lane-note]');
    await note.waitFor();
    assert.match(await note.innerText(), /Held for an update\. The update waits for the running commands to end\./);
    assert.match(await note.innerText(), /the 1 waiting keep their place/);
    assert.equal(await page.locator("[data-lane-resume]").count(), 0);
    assert.match(await page.locator('[data-lane="long"] [data-lane-entry="waiting"]').innerText(), /make checks/);
    await page.screenshot({path: capture, fullPage: true});
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
