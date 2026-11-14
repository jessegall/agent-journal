import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage();
    await page.goto(`${address}&windows=settings.settings`);
    const settings = page.locator('[data-window="settings.settings"]');
    await settings.getByRole("button", {name: "Command classification"}).click();
    const commands = settings.locator("[data-command-settings]");
    await commands.getByText("project-tests", {exact: true}).waitFor();
    assert.match(await commands.innerText(), /python3 -m pytest tests/);
    assert.match(await commands.innerText(), /test run/);
    assert.match(await commands.innerText(), /project-build/);
    assert.match(await commands.innerText(), /make build/);
    assert.match(await commands.innerText(), /build/);
    assert.doesNotMatch(await commands.innerText(), /project-search/);
} finally {
    await browser.close();
}
