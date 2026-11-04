import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage();
    const reads = [];
    page.on("request", (request) => {
        const body = request.postData() || "";
        if (body.includes('"output"')) reads.push(body);
    });
    await page.goto(address);
    await page.getByRole("button", {name: "Process queue"}).click();
    const row = page.locator('[data-queue-row="recent"]').filter({hasText: "make long-output"});
    await row.waitFor();
    assert.equal(reads.length, 0);
    await row.getByRole("button", {expanded: false}).click();
    const output = row.locator("[data-queue-output-body]");
    await output.filter({hasText: "line 249 of the run"}).waitFor();
    assert.ok(!(await output.textContent()).includes("line 199 of the run"));
    assert.ok(await output.evaluate((box) => box.scrollHeight - box.scrollTop - box.clientHeight < 2));
    await output.evaluate((box) => { box.scrollTop = 0; box.dispatchEvent(new Event("scroll")); });
    await output.filter({hasText: "line 199 of the run"}).waitFor();
    assert.ok(reads.some((body) => body.includes('"--before"')));
    await row.getByRole("button", {expanded: true}).click();
    const count = reads.length;
    await page.waitForTimeout(300);
    assert.equal(reads.length, count);
} finally {
    await browser.close();
}
