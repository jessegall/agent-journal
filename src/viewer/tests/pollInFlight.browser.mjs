import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const POLLED_WINDOW = "developer.hook-requests";
const SLOW_MILLISECONDS = 7000;
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
const [address] = process.argv.slice(2);
const until = async (isTrue, what) => {
    const deadline = Date.now() + 20000;
    while (!isTrue()) {
        assert.ok(Date.now() < deadline, what);
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
};
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    const faults = [];
    page.on("pageerror", (error) => faults.push(error.stack));
    let mode = "pass";
    let flying = 0;
    let mostFlying = 0;
    let asked = 0;
    await page.route(/\/api\/window(?:\?|$)/, async (route) => {
        const headers = route.request().headers();
        if (headers["x-journal-window"] !== POLLED_WINDOW || !headers["x-journal-data-only"]?.split(",").includes("requests")) return route.continue();
        asked += 1;
        flying += 1;
        mostFlying = Math.max(mostFlying, flying);
        const shown = mode;
        if (shown === "slow") await new Promise((resolve) => setTimeout(resolve, SLOW_MILLISECONDS));
        flying -= 1;
        return shown === "fail" ? route.fulfill({status: 500, body: "the server failed"}) : route.continue();
    });
    await page.goto(address);
    const target = new URL(page.url());
    target.searchParams.set("page", "developer.hook-requests");
    await page.goto(target.href);
    await until(() => asked >= 2, "the page never polled");

    mode = "slow";
    const beforeSlow = asked;
    await until(() => flying === 1, "the slow read never began");
    await new Promise((resolve) => setTimeout(resolve, SLOW_MILLISECONDS - 1000));
    assert.equal(asked, beforeSlow + 1, "a poll started while its own read was in flight");
    assert.equal(mostFlying, 1, "two polls were in flight at once");
    mode = "pass";
    await until(() => flying === 0, "the slow read never answered");

    mode = "fail";
    const beforeFailure = asked;
    await until(() => asked > beforeFailure, "the failing read never came");
    mode = "pass";
    const afterFailure = asked;
    await until(() => asked >= afterFailure + 2, "the poll did not resume after a failed read");
    assert.equal(mostFlying, 1, "two polls were in flight at once");
    assert.deepEqual(faults, []);
} finally {
    await browser.close();
}
