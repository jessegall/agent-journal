import {runScenarios} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN} from "./paired.mjs";

const HOLD_FOR = 900;
const state = await pairedState();

async function hold(page, words) {
    const bubble = page.locator("[data-hold]", {hasText: words}).first();
    await bubble.scrollIntoViewIfNeeded();
    const box = await bubble.boundingBox();
    const touch = await page.context().newCDPSession(page);
    const at = [{x: box.x + box.width / 2, y: box.y + box.height / 2}];
    await touch.send("Input.dispatchTouchEvent", {type: "touchStart", touchPoints: at});
    await page.waitForTimeout(HOLD_FOR);
    await touch.send("Input.dispatchTouchEvent", {type: "touchEnd", touchPoints: []});
    return page.getByRole("dialog", {name: "Message actions"});
}

await runScenarios(
    PAIR,
    {
        async "a message is pinned to the chat from its hold menu"(page) {
            await home(page);
            const menu = await hold(page, "The roses went in");
            await menu.getByRole("button", {name: "Pin to the chat"}).click();
            await page.getByRole("region", {name: "Pinned notices"}).getByText("The roses went in").waitFor({timeout: SHOWN});
        },
        async "your own message is deleted from its hold menu"(page) {
            await home(page);
            const menu = await hold(page, "The roses went in");
            await menu.getByRole("button", {name: "Delete"}).click();
            await page.locator("[data-hold]", {hasText: "The roses went in"}).waitFor({state: "detached", timeout: SHOWN});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
