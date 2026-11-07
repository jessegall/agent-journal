import {chromium} from "playwright-core";

const [address, windowName, output, waitFor] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1100}, reducedMotion: "reduce"});
    page.on("pageerror", (error) => console.error(error));
    await page.goto(`${address}&windows=${windowName}`);
    const window = page.locator(`[data-window="${windowName}"]`);
    await window.waitFor({timeout: 20000});
    if (waitFor) await page.locator(waitFor).first().waitFor({timeout: 20000});
    await page.waitForTimeout(1500);
    await page.screenshot({path: output, animations: "disabled"});
} finally {
    await browser.close();
}
