import {chromium} from "playwright-core";
import {runScenarios} from "../harness.mjs";

const PAIR = process.argv[2];
const PHONE = {viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true};
const SHOWN = 8000;

async function pairedState() {
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

const state = await pairedState();
const top = (page) => page.locator(".layer.page").last();
const open = (page, name) => top(page).getByRole("button", {name: new RegExp(`^${name}`)}).click();
const everything = (page, name) => page.getByRole("button", {name: new RegExp(`^${name}`)}).click();
const tab = (page, name) => page.getByRole("tab", {name: new RegExp(`^${name}`)}).click();

const home = async (page) => {
    await page.goto(new URL("./", PAIR).href);
    await page.getByPlaceholder("Message the agent").waitFor();
    await tab(page, "Everything");
};

const settings = async (page) => {
    await home(page);
    await everything(page, "Settings");
    await page.getByText("All settings").waitFor({timeout: SHOWN});
};

const region = async (page, name) => {
    await settings(page);
    await open(page, name);
};

await runScenarios(PAIR, {
    async "settings lists every region and a switch saves and stays"(page) {
        await region(page, "Features");
        await top(page).locator(".page-line").getByText("What the agent and the journal do.").waitFor({timeout: SHOWN});
        await open(page, "Agent");
        const toggle = top(page).getByRole("switch").first();
        await toggle.waitFor({timeout: SHOWN});
        const before = await toggle.getAttribute("aria-checked");
        await toggle.click();
        await page.getByText(/^Saved: /).waitFor({timeout: SHOWN});
        await page.reload();
        await page.getByPlaceholder("Message the agent").waitFor();
        await tab(page, "Everything");
        await everything(page, "Settings");
        await open(page, "Features");
        await open(page, "Agent");
        const after = await top(page).getByRole("switch").first().getAttribute("aria-checked");
        if (after === before) throw new Error("the switch went back after a reload");
    },
    async "settings search finds a setting by its words"(page) {
        await settings(page);
        await page.getByLabel("Search settings").fill("agent");
        await top(page).getByRole("switch").first().waitFor({timeout: SHOWN});
    },
    async "the phone region unpairs after asking, reaches tunler, and alerts have a key"(page) {
        await region(page, "Phone and share links");
        await top(page).getByRole("button", {name: /Unpair this phone/}).click();
        await page.getByRole("dialog").getByText("Unpair this phone?").waitFor({timeout: SHOWN});
        await page.getByRole("dialog").getByRole("button", {name: "Keep it paired"}).click();
        await top(page).getByRole("button", {name: /^(Install tunler|Tunler account|Connect a tunler account)/}).click();
        await page.getByRole("dialog").getByRole("button", {name: /^(Install tunler|Use another account|Connect)/}).first().waitFor({timeout: SHOWN});
        await region(page, "Alerts on this phone");
        await top(page).getByRole("button", {name: /Alerts key/}).waitFor({timeout: SHOWN});
    },
    async "services shows the empty state"(page) {
        await region(page, "Services");
        await top(page).getByText(/Nothing runs yet|not running|running/).first().waitFor({timeout: SHOWN});
    },
    async "system shows the version"(page) {
        await region(page, "About this journal");
        await top(page).getByText("About this journal").first().waitFor({timeout: SHOWN});
    },
    async "plugins offer an install with the commands shown first"(page) {
        await home(page);
        await everything(page, "Plugins");
        await top(page).getByRole("button", {name: "Add a plugin"}).last().click();
        await page.getByRole("button", {name: /Install a plugin/}).click();
        await page.getByLabel("Where it comes from").waitFor({timeout: SHOWN});
    },
    async "the title and name use the kit field and button, and save"(page) {
        await region(page, "Your title and name");
        await top(page).getByLabel("Your title").fill("Sir");
        const save = top(page).getByRole("button", {name: "Save"});
        const box = await save.boundingBox();
        if (box.height < 44) throw new Error(`the Save button is ${box.height}pt tall, under 44`);
        await save.click();
        await page.getByText("Saved: your title and name").waitFor({timeout: SHOWN});
    },
    async "skills list opens from Everything"(page) {
        await home(page);
        await everything(page, "Skills");
        await top(page).getByText("Instructions the agent loads when a job needs them.").waitFor({timeout: SHOWN});
    },
}, {voice: false, device: {...PHONE, storageState: state}});
