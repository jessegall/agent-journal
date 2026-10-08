import {runScenarios} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN} from "./paired.mjs";

const state = await pairedState();

async function waitingFeed(page) {
    await page.route(/\/feed(\?|$)/, async (route) => {
        const got = await (await route.fetch()).json();
        const running = {...(got.running || {}), awaiting: {text: "the test suite", on: "", since: Date.now() / 1000 - 180}};
        await route.fulfill({json: {...got, agent: "idle", running}});
    });
}

await runScenarios(
    PAIR,
    {
        async "the top bar says Waiting and what the agent waits on, and the message box carries the same words"(page) {
            await waitingFeed(page);
            await home(page);
            await page.getByRole("button", {name: /^Main agent, Waiting on the test suite/}).waitFor({timeout: SHOWN});
            await page.locator(".legend", {hasText: "Waiting"}).waitFor({timeout: SHOWN});
        },
        async "the words on the message box open the agent's sheet with the list of what it waits on"(page) {
            await waitingFeed(page);
            await home(page);
            await page.locator(".legend", {hasText: "Waiting"}).click();
            await page.getByRole("dialog").getByText("What the agent is waiting on").waitFor({timeout: SHOWN});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
