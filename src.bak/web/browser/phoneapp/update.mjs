import {mkdirSync, rmSync, writeFileSync} from "node:fs";
import {dirname} from "node:path";
import {runScenarios, shot} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN} from "./paired.mjs";

const MARK = process.argv[4];
const state = await pairedState();

const start = (step) => {
    mkdirSync(dirname(MARK), {recursive: true});
    writeFileSync(MARK, step);
};
const finish = () => rmSync(MARK, {force: true});

async function covered(page, step) {
    await home(page);
    start(step);
    const cover = page.getByRole("alertdialog", {name: "Updating the journal"});
    await cover.waitFor({timeout: SHOWN});
    return cover;
}

await runScenarios(
    PAIR,
    {
        async "while the journal updates the phone is covered by one sign that says what is happening, and a tap reaches nothing underneath"(page) {
            const began = Date.now();
            const cover = await covered(page, "Restarting the journal");
            const took = Date.now() - began;
            console.log(`the sign appeared ${took} ms after the update began`);
            await cover.getByText("Restarting the journal").waitFor({timeout: SHOWN});
            await shot(page, "phone-updating");
            const box = await page.getByPlaceholder("Message the agent").boundingBox();
            await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
            const focused = await page.evaluate(() => document.activeElement?.matches?.("textarea, input"));
            if (focused) throw new Error("a tap went through the sign to the message box");
            finish();
        },
        async "the sign keeps its size as its words change"(page) {
            const cover = await covered(page, "Installing the new version");
            const panel = cover.locator(".panel");
            const first = await panel.boundingBox();
            start("Loading the new version, which is the last step before the page answers again");
            await cover.getByText("Loading the new version", {exact: false}).waitFor({timeout: SHOWN});
            const second = await panel.boundingBox();
            finish();
            if (first.width !== second.width || first.height !== second.height) throw new Error(`the sign changed size: ${JSON.stringify(first)} then ${JSON.stringify(second)}`);
        },
        async "the sign lifts when the update is done"(page) {
            const cover = await covered(page, "Loading the new version");
            finish();
            await cover.waitFor({state: "detached", timeout: SHOWN * 2});
            await page.getByPlaceholder("Message the agent").waitFor({timeout: SHOWN});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
