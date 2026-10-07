import {chromium} from "playwright-core";

export const PAIR = process.argv[2];
export const DESK = process.argv[3];
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
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("WebAuthn.enable");
    const options = {protocol: "ctap2", transport: "internal", hasResidentKey: true, hasUserVerification: true, isUserVerified: true};
    await cdp.send("WebAuthn.addVirtualAuthenticator", {options: {...options, automaticPresenceSimulation: true}});
}

export async function allowOnComputer(page) {
    const computer = await page.context().browser().newPage({viewport: {width: 1280, height: 900}});
    try {
        await computer.goto(DESK);
        await computer.locator(".chat-notice", {hasText: "Set up Face ID for phone"}).getByRole("button", {name: "Allow", exact: true}).click({timeout: SHOWN});
    } finally {
        await computer.close();
    }
}

export const tab = (page, name) => page.getByRole("tab", {name: new RegExp(`^${name}`)}).click();

export const home = async (page) => {
    await page.goto(new URL("./", PAIR).href);
    await page.getByPlaceholder("Message the agent").waitFor();
};
