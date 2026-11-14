import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, option] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});

// the questions window with one open question: the option named on the command line is clicked and the card shows it as the answer
try {
    const page = await (await browser.newContext()).newPage();
    await page.setViewportSize({width: 1440, height: 900});
    await page.goto(address);
    await page.locator('.pane-tab:has-text("Questions")').first().click();
    const card = page.locator('[data-question-card].flush[data-state="open"]').first();
    await card.waitFor();
    await card.locator(`[data-question-option="${option}"]`).click();
    await page.locator('[data-question-card].flush[data-state="answered"] .question-answer').first().waitFor();
    assert.equal(await page.locator(".question-answer").first().textContent(), option);
} finally {
    await browser.close();
}
