import {chromium} from "playwright-core";

export const PAIR = process.argv[2];
export const PHONE = {viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true};
export const SHOWN = 8000;

export async function pairedState() {
    const browser = await chromium.launch();
    const context = await browser.newContext(PHONE);
    const page = await context.newPage();
    await page.goto(PAIR);
    await page.getByPlaceholder("Message the agent").waitFor();
    await page.getByRole("button", {name: "Skip the tour"}).click();
    const state = await context.storageState();
    await browser.close();
    return state;
}

export async function allowRuns(page) {
    await page.route(/\/p\/state$/, async (route) => {
        const response = await route.fetch();
        await route.fulfill({response, json: {...(await response.json()), runs: true}});
    });
}

export const tab = (page, name) => page.getByRole("tab", {name: new RegExp(`^${name}`)}).click();

export const home = async (page) => {
    await page.goto(new URL("./", PAIR).href);
    await page.getByPlaceholder("Message the agent").waitFor();
};
