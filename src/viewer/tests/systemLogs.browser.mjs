import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    page.on("pageerror", (error) => console.error(error.message));
    page.on("console", (message) => { if (message.type() === "error") console.error(message.text()); });
    await page.goto(address);
    await page.locator('[data-sidebar-window="developer.system-logs"]').click();
    const logs = page.locator("[data-system-logs]");
    await logs.locator("[data-log-line]").first().waitFor();
    assert.equal(await logs.locator("[data-log-line]").count(), 50);
    assert.match(await logs.innerText(), /browser journal note/);
    await logs.locator("[data-log-next]").click();
    await logs.locator("[data-log-line]").filter({hasText: /browser server line 0$/}).waitFor();
    assert.match(await logs.innerText(), /browser server line 0/);
    await logs.locator("[data-log-source]").selectOption("journal");
    await page.waitForFunction(() => document.querySelectorAll("[data-log-line]").length === 1);
    assert.match(await logs.innerText(), /browser journal note/);
    await logs.locator("[data-log-pause]").click();
    assert.equal(await logs.locator("[data-log-pause]").innerText(), "Resume");
    assert.equal(await logs.locator("[data-log-next]").isDisabled(), true);
    await logs.locator("[data-log-pause]").click();
    await logs.locator("[data-log-level]").selectOption("error");
    await logs.getByText("No log lines found.").waitFor();
    const image = new URL("../../../.journal/system-logs-browser.png", import.meta.url).pathname;
    await logs.locator("[data-log-level]").selectOption("");
    await logs.locator("[data-log-line]").waitFor();
    await page.screenshot({path: image});
    console.log("System logs opened, paged, filtered and paused in Chromium.");
} finally {
    await browser.close();
}
