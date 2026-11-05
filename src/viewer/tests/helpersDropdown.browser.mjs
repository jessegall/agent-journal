import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, helper] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.goto(address);
    await page.locator("[data-helpers]").click();
    const dropdown = page.locator('[data-dropdown="agents.helpers"]');
    const card = dropdown.locator(`[data-agent-open="${helper}"]`);
    await card.waitFor();
    const before = await dropdown.boundingBox();
    const name = card.locator("[data-agent-name]");
    assert.equal(await name.evaluate((element) => getComputedStyle(element).textOverflow), "ellipsis");
    await card.click();
    await card.getByRole("button", {name: "Back to the list"}).waitFor();
    const after = await dropdown.boundingBox();
    assert.ok(Math.abs(before.width - after.width) < 1, JSON.stringify({before, after}));
    assert.ok(Math.abs(after.width - 360) < 1, JSON.stringify(after));
} finally {
    await browser.close();
}
