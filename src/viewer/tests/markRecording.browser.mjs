import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    page.on("pageerror", (error) => process.stdout.write(`${error.message}\n`));
    page.on("response", async (response) => {
        if (response.url().includes("/api/line")) process.stdout.write(`${response.status()} ${response.request().postData()?.slice(0, 100)} ${(await response.text()).slice(0, 120)}\n`);
    });
    await page.goto(address);
    const mark = page.locator(".history .mark", {hasText: "make build"}).locator(".top").first();
    await mark.waitFor();
    await mark.click();
    await page.waitForResponse((response) => response.request().postData()?.includes("record-mark-motion"), {timeout: 4000});
} finally {
    await browser.close();
}
