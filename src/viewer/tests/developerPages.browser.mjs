import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.goto(address);
    const sidebar = page.locator("[data-sidebar]");
    const numbers = sidebar.locator('[data-sidebar-window="developer.numbers"]');
    const requests = sidebar.locator('[data-sidebar-window="developer.hook-requests"]');
    const section = sidebar.locator('[data-fold="developer"]');
    await sidebar.locator('[data-sidebar-window="settings.settings"]').waitFor();
    await sidebar.locator('[data-sidebar-window="developer.system-logs"]').waitFor();
    assert.equal(await section.count(), 1);
    const set = async (key, value) => {
        const answer = await page.evaluate(async ({key, value}) => {
            const response = await fetch("/api/line", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({window: "settings.settings", environment: "main", line: ["setting", "set", key, value, "--project"]})});
            return response.json();
        }, {key, value});
        assert.equal(answer.code, 0, JSON.stringify(answer));
    };
    const costs = "journal.core.developer.tools.hooks.terminal-durations";
    const log = "journal.core.developer.tools.hooks.request-log";
    await set(costs, "true");
    await numbers.waitFor();
    assert.equal(await requests.count(), 0);
    await set(log, "true");
    await requests.waitFor();
    assert.equal((await requests.innerText()).trim(), "Request log");
    await set(costs, "false");
    await numbers.waitFor({state: "detached"});
    assert.equal(await requests.count(), 1);
    await set(log, "false");
    assert.equal(await section.count(), 1);
    assert.equal(await sidebar.locator('[data-sidebar-window="developer.system-logs"]').count(), 1);
} finally {
    await browser.close();
}
