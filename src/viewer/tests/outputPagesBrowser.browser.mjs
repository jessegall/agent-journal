import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 800}});
    const reads = [];
    page.on("request", (request) => reads.push(request.postData() || ""));
    await page.goto(address);
    await page.locator("[data-dock-fold]").click();
    const terminal = page.locator("[data-output-terminal]");
    await terminal.filter({hasText: "line 1999 of the run"}).waitFor();
    const shown = () => terminal.evaluate((box) => box.textContent.split("\n").length);
    assert.ok((await shown()) <= 300, `the first read showed ${await shown()} lines`);
    assert.ok(!(await terminal.textContent()).includes("line 0 of the run"), "the first read holds the start of the output");
    await terminal.evaluate((box) => {
        box.scrollTop = 0;
        box.dispatchEvent(new Event("scroll"));
    });
    await terminal.filter({hasText: "line 1500 of the run"}).waitFor();
    assert.ok((await shown()) <= 600, `the second read showed ${await shown()} lines`);
    assert.ok(!reads.some((body) => body.includes("--all")), "an output was read whole");
} finally {
    await browser.close();
}
