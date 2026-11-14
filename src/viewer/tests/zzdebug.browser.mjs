import {chromium} from "playwright-core";

const [address, view] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1400, height: 800}});
    await page.goto(`${address}&page=${view}`);
    await page.waitForTimeout(5000);
    console.log("ROWS:", (await page.locator("[data-reader-row]").allInnerTexts()).join(" | "));
    const first = page.locator("[data-reader-row]").first();
    await first.click({button: "right"});
    await page.waitForTimeout(500);
    console.log("MENU:", (await page.locator("[data-menu-item]").allInnerTexts()).join(" | "));
} finally {
    await browser.close();
}
