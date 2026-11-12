import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}});
    page.on("pageerror", (error) => console.error(error.message));
    page.on("console", (message) => { if (message.type() === "error") console.error(message.text()); });
    page.on("requestfailed", (request) => console.error(request.url(), request.failure()));
    await page.goto(`${address}&page=profiles.profiles`);
    await page.locator("[data-profile-new]").waitFor({timeout: 8000}).catch(async (error) => {
        console.error(await page.locator("body").innerText());
        throw error;
    });
    await page.locator("[data-profile-new]").click();
    const panel = page.locator("[data-profile-panel]");
    await panel.locator("#profile-name").fill("sample-browser");
    await panel.locator("#profile-description").fill("Checks the third program");
    await panel.locator('[data-tab="model"]').click();
    await panel.getByRole("radio", {name: "Sample program", exact: true}).click();
    const picker = panel.locator('[data-profile-model="sample"]');
    await picker.locator("[data-drop-head]").click();
    await page.locator('[data-drop-item="sample-fast"]').click();
    assert.match(await panel.innerText(), /The parent program/);
    assert.match(await panel.innerText(), /chosen at start/);
    await page.screenshot({path: new URL("../../../.journal/third-provider-browser.png", import.meta.url).pathname});
    await page.locator("[data-profile-save]").click();
    await page.locator("[data-profile-notice]").filter({hasText: "sample-browser saved"}).waitFor();
    console.log("S70: third provider selected and saved through the profile page in Chromium.");
} finally {
    await browser.close();
}
