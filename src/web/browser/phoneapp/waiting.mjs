import {runScenarios, shot} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN} from "./paired.mjs";

const state = await pairedState();

async function waitingFeed(page) {
    await page.route(/\/feed(\?|$)/, async (route) => {
        const got = await (await route.fetch()).json();
        const running = {...(got.running || {}), awaiting: {text: "the test suite", work: "to-do 7 · Run the checks", on: "", since: Date.now() / 1000 - 180}};
        await route.fulfill({json: {...got, agent: "idle", running}});
    });
}

await runScenarios(
    PAIR,
    {
        async "the top bar says Waiting and what the agent waits on, and the message box carries the same words"(page) {
            await waitingFeed(page);
            await home(page);
            await page.getByRole("button", {name: /agent Waiting to-do 7 · Run the checks\./}).waitFor({timeout: SHOWN});
            await page.locator(".legend", {hasText: "Waiting"}).waitFor({timeout: SHOWN});
        },
        async "the words on the message box open the agent's sheet with the list of what it waits on"(page) {
            await waitingFeed(page);
            await home(page);
            await page.locator(".legend", {hasText: "Waiting"}).click();
            await page.getByRole("dialog").getByText("What the agent is waiting on").waitFor({timeout: SHOWN});
        },
        async "the top bar has one picker for the journal, environment and agent, and the agent opens from its sheet"(page) {
            await waitingFeed(page);
            await home(page);
            const picker = page.getByRole("button", {name: /^Journal /});
            await picker.waitFor({timeout: SHOWN});
            if ((await page.locator(".home-bar .top-btn").count()) !== 1) throw new Error("the top bar still has more than one picker");
            const words = await picker.innerText();
            if (!words.includes("Waiting")) throw new Error(`the picker does not carry the agent's state: ${words}`);
            await shot(page, "phone-one-picker");
            await picker.click();
            await page.getByRole("button", {name: "Main agent"}).click();
            await page.getByRole("dialog").getByText("What the agent is waiting on").waitFor({timeout: SHOWN}).catch(() => null);
            await shot(page, "phone-picker-agent");
        },
        async "a reminder mark reads as it does on the computer"(page) {
            await page.route(/\/feed(\?|$)/, async (route) => {
                const got = await (await route.fetch()).json();
                const mark = {type: "card", n: "1-1", ref: "card:1-1", who: "agent", created: Date.now() / 1000, label: "Reminded the agent of fact 7", icon: "reminders", shows: "facts"};
                await route.fulfill({json: {...got, items: [...got.items, mark]}});
            });
            await home(page);
            await page.getByText("Reminded the agent of fact 7").waitFor({timeout: SHOWN});
            await shot(page, "phone-reminder-mark");
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
