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
    const panel = page.locator("[data-execution-classes]");
    await panel.locator('[data-class-row="merge"]').waitFor();
    await panel.locator("[data-class-name]").fill("browser tests");
    await panel.locator("[data-class-pattern]").fill("^npm run e2e");
    assert.equal(await panel.locator("[data-class-add]").isDisabled(), true);
    await panel.locator("[data-class-preview]").click();
    const preview = panel.locator("[data-class-preview-lines]");
    await preview.waitFor();
    assert.match(await preview.innerText(), /npm run e2e -- --headed/);
    await panel.locator("[data-class-add]").click();
    await panel.locator('[data-class-row="browser tests"]').waitFor();
    assert.match(await panel.locator('[data-class-row="browser tests"]').innerText(), /Your own/);
    await page.screenshot({path: capture, fullPage: true});
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
