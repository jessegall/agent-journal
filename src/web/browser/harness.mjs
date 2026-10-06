import {chromium} from "playwright-core";

const FIRST_CHOICE_WAIT = 8000;
const LOCAL = /^http:\/\/127\.0\.0\.1[:/]/;

const isOutside = (address) => !LOCAL.test(address.href);

export const reply = (route, body, status = 200) => route.fulfill({status, contentType: "application/json", body: JSON.stringify(body)});

async function chooseVoice(browser, url) {
    const page = await browser.newPage();
    await page.route(isOutside, (route) => route.abort());
    await page.goto(url);
    const keep = page.getByRole("button", {name: "Keep Butler"});
    if (await keep.waitFor({timeout: FIRST_CHOICE_WAIT}).then(() => true, () => false)) await keep.click();
    await page.getByRole("dialog", {name: "How should the agent talk to you?"}).waitFor({state: "detached", timeout: FIRST_CHOICE_WAIT});
    await page.close();
}

export async function runScenarios(url, scenarios) {
    const browser = await chromium.launch();
    await chooseVoice(browser, url);
    const failures = {};
    try {
        for (const [name, scenario] of Object.entries(scenarios)) {
            const context = await browser.newContext({viewport: {width: 1280, height: 900}});
            const page = await context.newPage();
            page.setDefaultTimeout(15000);
            await page.route(isOutside, (route) => route.abort());
            try {
                await scenario(page, url);
            } catch (error) {
                failures[name] = String(error.message).split("\n").slice(0, 4).join(" ");
            }
            await context.close();
        }
    } finally {
        await browser.close();
    }
    console.log(JSON.stringify(failures));
}
