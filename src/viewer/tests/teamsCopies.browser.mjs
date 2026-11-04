import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, planText] = process.argv.slice(2);
const plan = JSON.parse(planText);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});

// follows a plan of steps on the Teams page: choosing a tab, pressing a button, and waiting for or refusing a text
async function follow(page, step) {
    if (step.tab) await page.locator(`[data-teams-tabs] button:has-text("${step.tab}")`).click();
    if (step.click) await page.locator(step.click).first().click();
    if (step.button) await page.getByRole("button", {name: step.button, exact: true}).first().click();
    if (step.wait) await page.locator(step.wait).waitFor({timeout: 15000});
    if (step.press) await page.keyboard.press(step.press);
    if (step.expect) await page.waitForFunction((text) => document.body.innerText.includes(text), step.expect, {timeout: 15000});
    if (step.absent) assert.ok(!(await page.locator("body").innerText()).includes(step.absent), `${step.absent} is shown`);
    if (step.count) assert.equal(await page.locator(step.count.selector).count(), step.count.number);
}

try {
    const page = await browser.newPage({viewport: {width: 1100, height: 900}});
    const problems = [];
    page.on("console", (message) => message.type() === "error" && problems.push(message.text()));
    page.on("pageerror", (error) => problems.push(error.message));
    await page.goto(`${address}&page=library.teams`);
    await page.locator("[data-teams-header]").waitFor({timeout: 10000});
    for (const step of plan) {
        await follow(page, step).catch(async (error) => {
            throw new Error(`${error.message}\nstep ${JSON.stringify(step)}\n${await page.locator("body").innerText()}\n${problems.join("\n")}`);
        });
    }
    assert.doesNotMatch(await page.locator("body").innerText(), /\brow\b|resource/);
} finally {
    await browser.close();
}
