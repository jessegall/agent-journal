import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1100, height: 720}});
    await page.goto(address);
    await page.locator(".dock-title").filter({hasText: "Fix the cart"}).waitFor();
    await page.locator(".dock-facts").filter({hasText: "Weight: 7"}).waitFor();
    await page.locator(".dock-title").filter({hasText: "The cart total is in cents"}).waitFor();
} finally {
    await browser.close();
}
