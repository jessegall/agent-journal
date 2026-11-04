import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage();
    await page.goto(`${address}&page=secrets.secrets`);
    const request = page.locator('[data-secret-ask="1"]');
    await request.waitFor();
    assert.equal((await request.innerText()).replace(/\s+/g, " ").trim(), "Github Add credentials");
    await request.click();
    const credential = page.locator('[data-secret-value="key"]');
    assert.equal(await credential.getAttribute("placeholder"), "Paste or type your credential");
    await credential.fill("browser-story-credential");
    await page.locator("[data-secret-save]").click();
    const edit = page.locator('[data-row="1"] [data-secret-update]');
    await edit.waitFor();
    assert.equal((await edit.innerText()).trim(), "Edit secret");
    await edit.click();
    assert.equal(await credential.getAttribute("placeholder"), "Leave blank to keep the saved credential");
    assert.equal(await credential.inputValue(), "");
    await page.getByRole("button", {name: "Cancel", exact: true}).click();
    await page.locator("[data-secret-new]").click();
    await page.locator("[data-secret-create]").waitFor();
    assert.equal((await page.locator("[data-secret-create]").innerText()).trim(), "Create secret");
    assert.doesNotMatch(await page.locator("body").innerText(), /Enter the values|Needs a value|Type what it needs/);
} finally {
    await browser.close();
}
