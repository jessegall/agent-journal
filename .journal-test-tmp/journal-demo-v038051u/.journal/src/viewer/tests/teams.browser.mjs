import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, serverAddress, token, searchWord, rowNumber] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 900}});
    const problems = [];
    page.on("console", (message) => message.type() === "error" && problems.push(message.text()));
    page.on("pageerror", (error) => problems.push(error.message));
    page.on("requestfailed", (request) => problems.push(`failed ${request.url()}`));
    await page.goto(`${address}&page=library.teams`);
    await page.locator("[data-library-connect]").waitFor({timeout: 10000}).catch(async (error) => {
        throw new Error(`${error.message}\n${await page.locator("body").innerText()}\n${problems.join("\n")}`);
    });
    assert.equal(await page.locator("[data-teams-header]").count(), 0);
    await page.locator("[data-library-address]").fill(serverAddress);
    await page.locator("[data-library-token]").fill("jsl_wrong_token");
    await page.locator("[data-library-submit]").click();
    await page.locator("[data-library-refusal]").waitFor();
    assert.match(await page.locator("[data-library-refusal]").innerText(), /did not accept this token/);
    await page.locator("[data-library-token]").fill(token);
    await page.locator("[data-library-submit]").click();
    const header = page.locator("[data-teams-header]");
    await header.waitFor();
    const headerText = (await header.innerText()).replace(/\s+/g, " ");
    assert.match(headerText, /Connected: .*Role: Edit/);
    assert.match(headerText, /Connection: not encrypted/);
    assert.equal(await page.locator("[data-library-token]").count(), 0);

    const items = page.locator("[data-library-item]");
    await items.first().waitFor();
    assert.ok((await items.count()) >= 2);
    await page.getByPlaceholder("Search the library").fill(searchWord);
    await page.locator(`[data-library-item^="doc:"]:has-text("${searchWord}")`).first().waitFor();
    await page.waitForFunction((count) => document.querySelectorAll("[data-library-item]").length < count, await items.count());
    assert.equal(await page.locator("[data-library-item]").count(), 1);

    await page.locator("[data-library-open]").first().click();
    const panel = page.locator("[data-library-panel]");
    await panel.waitFor();
    assert.match(await panel.innerText(), /Version: 1/);
    assert.match(await panel.locator("[data-library-fields]").innerText(), /Tag first\./);
    await page.keyboard.press("Escape");

    await page.getByPlaceholder("Search the library").fill("");
    await page.locator('[data-teams-tabs] button:has-text("On this journal")').click();
    await page.locator("[data-library-share-field]").fill(`doc ${rowNumber}`);
    await page.locator("[data-library-share-submit]").click();
    await page.locator("[data-library-shared]").waitFor();
    assert.match(await page.locator("[data-library-shared]").innerText(), new RegExp(`^doc ${rowNumber} is now library doc \\d+, version 1$`));
    assert.doesNotMatch(await page.locator("body").innerText(), /\brow\b|resource/);
} finally {
    await browser.close();
}
