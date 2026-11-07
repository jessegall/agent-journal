import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    await page.goto(address);
    await page.getByText("Skill journal loaded", {exact: true}).click();
    try {
        await page.locator("[data-resource-panel] [data-skill-text]", {hasText: "journal"}).waitFor({timeout: 5000});
    } catch (error) {
        throw new Error(await page.locator("[data-resource-panel]").innerText(), {cause: error});
    }
    await page.locator("[data-resource-close]").click();
    await page.getByText("Skill journal-gone loaded", {exact: true}).click();
    await page.getByText("The skill journal-gone is no longer available.", {exact: true}).waitFor();
} finally {
    await browser.close();
}
