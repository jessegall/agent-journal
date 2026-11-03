import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    page.on("pageerror", (error) => process.stdout.write(`${error.message}\n`));
    await page.goto(address);
    const mark = page.locator(".history .mark", {hasText: "make build"}).locator(".top").first();
    await mark.waitFor();
    const recording = page.waitForResponse((response) => response.request().postData()?.includes("record-mark-motion"), {timeout: 4000});
    await mark.click();
    await recording;
} finally {
    await browser.close();
}
