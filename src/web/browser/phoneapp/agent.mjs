import {runScenarios} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN, tab} from "./paired.mjs";

const state = await pairedState();
const sheet = (page) => page.getByRole("dialog");
const top = (page) => page.locator(".layer.page").last();

async function chat(page) {
    await home(page);
    const suggestion = sheet(page).getByRole("button", {name: "Close", exact: true});
    await suggestion.click({timeout: 3000}).catch(() => null);
    await sheet(page).waitFor({state: "detached", timeout: SHOWN});
}

async function act(page, label) {
    const quick = top(page).getByRole("button", {name: label, exact: true});
    if (await quick.isVisible()) return quick.click();
    await top(page).getByRole("button", {name: "More", exact: true}).click();
    await sheet(page).getByRole("button", {name: new RegExp(`^${label}`)}).click();
}

async function more(page, label) {
    await chat(page);
    await page.getByRole("button", {name: /^Main agent/}).click();
    await sheet(page).getByRole("button", {name: new RegExp(`^${label}`)}).click();
}

await runScenarios(
    PAIR,
    {
        async "the agent sheet tells its model and opens the model choices"(page) {
            await more(page, "Model");
            await top(page).getByText("claude-opus-5-5").first().waitFor({timeout: SHOWN});
        },
        async "the agent sheet lists its loaded skills"(page) {
            await more(page, "Skills loaded");
            await top(page).getByRole("button", {name: /^journal/}).waitFor({timeout: SHOWN});
        },
        async "the agent's terminal queues a command"(page) {
            const sent = [];
            await page.route(/\/shell$/, (route) => (sent.push(route.request().postDataJSON()), route.fulfill({status: 200, body: "{}"})));
            await more(page, "Agent terminal");
            await top(page).getByText("Nothing has run yet.").waitFor({timeout: SHOWN});
            await top(page).getByRole("button", {name: /^Run a command/}).click();
            await sheet(page).getByLabel("Command").fill("npm test");
            await sheet(page).getByRole("button", {name: "Run", exact: true}).click();
            await page.getByText("Runs after the agent's turn: npm test").waitFor({timeout: SHOWN});
            if (sent[0]?.command !== "npm test") throw new Error(`the terminal was sent: ${JSON.stringify(sent)}`);
        },
        async "the agent's repeating prompts say when they run"(page) {
            await more(page, "Repeating prompts");
            await top(page).getByText("every 10 minutes").waitFor({timeout: SHOWN});
            await top(page).getByText("Water the roses").waitFor();
        },
        async "the activity feed lists what happened and opens it"(page) {
            await more(page, "Activity");
            await top(page).getByText("What the agent is doing now").waitFor({timeout: SHOWN});
            await top(page).getByRole("button", {name: /Water the plants/}).first().click();
            await page.locator(".layer.page").last().getByText("Water the plants").first().waitFor({timeout: SHOWN});
        },
        async "a new profile is edited, then used"(page) {
            await chat(page);
            await tab(page, "Everything");
            await page.getByRole("button", {name: /^Profiles/}).click();
            await top(page).getByRole("button", {name: /^New profile/}).first().click();
            await sheet(page).getByLabel("Name").fill("Garden voice");
            await sheet(page).getByLabel("How the agent talks").fill("Short and warm");
            await sheet(page).getByLabel("A sample line").fill("The roses are watered.");
            await sheet(page).getByRole("button", {name: "Add"}).click();
            await top(page).getByRole("button", {name: /Garden voice/}).first().click();
            await act(page, "Edit the profile");
            await sheet(page).getByLabel("Name").fill("Garden helper");
            await sheet(page).getByRole("radio", {name: "First name"}).click();
            await sheet(page).getByRole("button", {name: /^Edit the profile|^Save/}).click();
            await page.getByText("Profile saved").waitFor({timeout: SHOWN});
            await act(page, "Use this profile");
            await page.getByText("The agent now talks as Garden helper").waitFor({timeout: SHOWN});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
