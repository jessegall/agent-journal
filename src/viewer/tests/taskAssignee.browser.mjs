import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, shot, workerId] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    const link = new URL(address);
    link.searchParams.set("page", "tasks.tasks");
    await page.goto(link.href);
    const icons = (task) => page.locator(`[data-row="${task}"] [data-task-icons]`);
    await icons(1).waitFor({timeout: 10000}).catch(async (error) => {
        await page.screenshot({path: `${shot}-failed.png`});
        throw new Error(`${error.message}\n${await page.locator("body").innerText()}`);
    });
    // task 1 is the main agent's, task 2 a worker's, task 3 a user's and task 4 nobody's; none is started
    assert.equal(await icons(1).locator("[data-task-agent] [data-agent-main-icon]").count(), 1);
    assert.equal(await icons(2).locator("[data-task-agent] [data-icon='agent']").count(), 1);
    assert.equal(await icons(2).locator("[data-task-agent]").getAttribute("aria-label"), `Worker ${workerId}`);
    assert.equal(await icons(3).locator("[data-task-person] [data-icon='people']").count(), 1);
    assert.equal(await icons(3).locator("[data-task-person]").getAttribute("aria-label"), "Assigned: Ada");
    assert.equal(await icons(3).locator("[data-task-agent]").count(), 0);
    assert.equal(await icons(4).locator("[data-task-agent], [data-task-person]").count(), 0);
    assert.equal(await icons(4).locator(".cell.empty").count() >= 1, true);
    for (const task of [1, 2, 3]) {
        assert.equal(await icons(task).locator(".cell.agent.queued").count(), 1, `task ${task} is not started, so its icon is drawn as waiting`);
    }
    await page.screenshot({path: `${shot}.png`});
    await icons(3).locator("[data-task-person]").click();
    assert.equal(await page.locator("[data-inspector]").count(), 0, "a click on a user opens nothing");
    await icons(2).locator("[data-task-agent]").click();
    await page.locator("[data-inspector]").waitFor({timeout: 10000});
} finally {
    await browser.close();
}
