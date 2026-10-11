import {runScenarios, shot} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN} from "./paired.mjs";

const state = await pairedState();
const UPDATE = /\/p\/update(\?|$)/;
const RUNNING = {updating: true, ready: true, step: "Restarting the journal", countdown: {}};

async function reply(page, got) {
    await page.unroute(UPDATE);
    await page.route(UPDATE, (route) => route.fulfill({json: got}));
}

async function covered(page, step) {
    await reply(page, {...RUNNING, step});
    await home(page);
    const cover = page.getByRole("alertdialog", {name: "Updating the journal"});
    await cover.waitFor({timeout: SHOWN});
    return cover;
}

await runScenarios(
    PAIR,
    {
        async "while the journal updates the phone is covered by one sign that says what is happening, and a tap reaches nothing underneath"(page) {
            const cover = await covered(page, "Restarting the journal");
            await cover.getByText("Restarting the journal").waitFor({timeout: SHOWN});
            await shot(page, "phone-updating");
            const box = await page.getByPlaceholder("Message the agent").boundingBox();
            await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
            const focused = await page.evaluate(() => document.activeElement?.matches?.("textarea, input"));
            if (focused) throw new Error("a tap went through the sign to the message box");
        },
        async "the sign keeps its size as its words change"(page) {
            const cover = await covered(page, "Installing the new version");
            const panel = cover.locator(".panel");
            const first = await panel.boundingBox();
            await reply(page, {...RUNNING, step: "Loading the new version, which is the last step before the page answers again"});
            await cover.getByText("Loading the new version", {exact: false}).waitFor({timeout: SHOWN});
            const second = await panel.boundingBox();
            if (first.width !== second.width || first.height !== second.height) throw new Error(`the sign changed size: ${JSON.stringify(first)} then ${JSON.stringify(second)}`);
        },
        async "the sign lifts when the update is done"(page) {
            const cover = await covered(page, "Loading the new version");
            await reply(page, {updating: false, ready: true, step: "", countdown: {}});
            await cover.waitFor({state: "detached", timeout: SHOWN * 2});
            await page.getByPlaceholder("Message the agent").waitFor({timeout: SHOWN});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
