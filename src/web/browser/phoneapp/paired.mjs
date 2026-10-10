import {openBrowser} from "../harness.mjs";

export const PAIR = process.argv[2];
export const DESK = process.argv[3];
export const PHONE = {viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true};
export const SHOWN = 8000;

export async function pairedState() {
    const browser = await openBrowser();
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

const VOICE_WAIT = 3000;

export async function allowOnComputer(page) {
    const computer = await page
        .context()
        .browser()
        .newPage({viewport: {width: 1280, height: 900}});
    try {
        await computer.goto(DESK);
        const keep = computer.getByRole("button", {name: "Keep Butler"});
        if (await keep.waitFor({timeout: VOICE_WAIT}).then(() => true, () => false)) await keep.click();
        await computer.getByRole("dialog", {name: "How should the agent talk to you?"}).waitFor({state: "detached", timeout: VOICE_WAIT}).catch(() => {});
        await computer
            .locator(".chat-notice", {hasText: "Set up Face ID for phone"})
            .getByRole("button", {name: "Allow", exact: true})
            .click({timeout: SHOWN});
    } finally {
        await computer.close();
    }
}

export const tab = (page, name) => page.getByRole("tab", {name: new RegExp(`^${name}`)}).click();

export const home = async (page) => {
    await page.goto(new URL("./", PAIR).href);
    await page.getByPlaceholder("Message the agent").waitFor();
};

export async function openPlace(page, label) {
    await home(page);
    await tab(page, "Everything");
    await page.getByRole("button", {name: new RegExp(`^${label}`)}).click();
}
