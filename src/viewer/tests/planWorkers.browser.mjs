import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, worker, shots] = process.argv.slice(2);
const NAME = "Lady Lovelace";
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.goto(address);

    // the agent card of the helpers dropdown has the job and the tasks queued behind it
    await page.locator("[data-helpers]").click();
    const card = page.locator(`[data-dropdown="agents.helpers"] [data-agent-open="${worker}"]`);
    await card.waitFor();
    assert.ok((await card.locator("[data-agent-job]").textContent()).length > 0);
    await page.screenshot({path: `${shots}-card.png`});
    await page.keyboard.press("Escape");

    // the plan page names the agent under its phase and on each task it holds or has queued
    await page.goto(`${address}#open=plans:1`);
    await page.locator("[data-plan-inspector]").waitFor();
    await page.locator("[data-plan-phase-agent]").first().waitFor();
    assert.equal(await page.locator("[data-plan-agent]").count(), 3);
    for (const text of await page.locator("[data-plan-agent]").allTextContents()) assert.equal(text, NAME);
    assert.ok(!(await page.locator("[data-plan-inspector]").textContent()).includes("Agent "));
    await page.screenshot({path: `${shots}-plan.png`});

    // a task the agent holds and a task queued for it say so in the inspector
    await page.goto(`${address}#open=tasks:2`);
    const note = page.locator("[data-task-held-by]");
    await note.waitFor();
    assert.ok((await note.textContent()).startsWith(NAME));
    await page.screenshot({path: `${shots}-task.png`});
} finally {
    await browser.close();
}
