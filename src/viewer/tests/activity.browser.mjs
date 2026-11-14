import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, capture] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.goto(address);
    await page.locator("[data-activity-toggle]").click();
    const activity = page.locator("[data-activity]");
    const group = activity.locator("[data-activity-group]").first();
    await group.waitFor();
    assert.match(await group.innerText(), /agent updates?/i);
    await group.click();
    assert.ok(await activity.locator("[data-activity-nested]").count() >= 2);
    await page.screenshot({path: capture, animations: "disabled"});
    await activity.evaluate((element) => {
        window.activityMotion = false;
        new MutationObserver(() => {
            if (element.querySelector(".act-enter-active")) window.activityMotion = true;
        }).observe(element, {attributes: true, childList: true, subtree: true});
    });
    const result = await page.evaluate(async () => {
        const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "tasks.tasks", environment: "main", line: ["task", "make", "Activity arrival", "--brief", "Watch the new task", "--environment", "main"]})});
        return response.json();
    });
    assert.equal(result.code, 0, JSON.stringify(result));
    await page.waitForFunction(() => window.activityMotion, null, {timeout: 10000});
    await activity.getByText("New task", {exact: false}).first().waitFor();
} finally {
    await browser.close();
}
