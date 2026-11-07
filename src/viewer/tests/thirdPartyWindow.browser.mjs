import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});

try {
    const page = await browser.newPage({viewport: {width: 1280, height: 900}});
    const problems = [];
    page.on("pageerror", (error) => problems.push(error.message));
    page.on("console", (message) => message.type() === "error" && problems.push(message.text()));
    await page.goto(`${address}&page=findings.findings`);
    await page.locator("[data-findings]").waitFor({timeout: 8000}).catch(async (error) => {
        throw new Error(`${error.message}\n${(await page.locator("body").innerText()).slice(-600)}\n${problems.join("\n")}`);
    });
    const button = page.locator('[data-findings] [data-button="findings.note"]');
    await button.waitFor({timeout: 15000});
    const answer = page.waitForResponse((response) => response.url().endsWith("/api/line") && response.request().postDataJSON().line?.join(" ") === "findings note 1");
    await button.click();
    console.log("The window's own prompt comes first, then the button's");
    await page.getByRole("button", {name: "Allow", exact: true}).click();
    await page.getByRole("button", {name: "Allow", exact: true}).click();
    assert.match(await (await answer).text(), /Noted plan 1: Cart security/);
    assert.deepEqual(problems, []);
} finally {
    await browser.close();
}
