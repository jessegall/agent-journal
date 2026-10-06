import {runScenarios} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN, tab} from "./paired.mjs";

const MESSAGES = /\/p\/message$/;

const state = await pairedState();

async function place(page, label) {
    await home(page);
    await tab(page, "Everything");
    await page.getByRole("button", {name: new RegExp(`^${label}`)}).click();
}

const sheet = (page) => page.getByRole("dialog");

await runScenarios(
    PAIR,
    {
        async "a plan shows its phase and how many of its to-dos are done"(page) {
            await place(page, "Plans");
            await page.getByText("Phase 1 of 1: Watering").waitFor({timeout: SHOWN});
            await page.getByText("0 of 1 to-do done").waitFor();
        },
        async "a suggestion is adjusted from its row and shows among the closed"(page) {
            await place(page, "Suggestions");
            await page.getByRole("button", {name: "Everything you can do with Suggestion 1"}).click();
            await sheet(page)
                .getByRole("button", {name: /^Adjust/})
                .click();
            await sheet(page).getByLabel("What to do differently").fill("Only red roses");
            await sheet(page).getByRole("button", {name: "Send the answer"}).click();
            await page.getByText("Answered suggestion 1: Only red roses").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Show 1 closed"}).click();
            await page.getByText("Adjusted").waitFor({timeout: SHOWN});
        },
        async "a fact closed from its row opens again with Undo"(page) {
            await place(page, "Facts");
            await page.getByRole("button", {name: "Everything you can do with Fact 1"}).click();
            await sheet(page)
                .getByRole("button", {name: /^Close the fact/})
                .click();
            await page.getByText("Closed fact 1").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Undo"}).click();
            await page.getByText("Fact 1 is open again").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "The roses face south"}).waitFor({timeout: SHOWN});
        },
        async "a fact moves to another environment from its row"(page) {
            await place(page, "Facts");
            await page.getByRole("button", {name: "Everything you can do with Fact 1"}).click();
            await sheet(page).getByRole("button", {name: "Move to another environment"}).click();
            await sheet(page).getByLabel("Environment").fill("garden");
            await sheet(page).getByRole("button", {name: "Move", exact: true}).click();
            await page.getByText("Moved fact 1 to garden").waitFor({timeout: SHOWN});
            await page.getByText("No open facts").waitFor({timeout: SHOWN});
        },
        async "an unread question is marked as read from its row"(page) {
            await place(page, "Questions");
            await page.getByRole("button", {name: "Everything you can do with Question 1"}).click();
            await sheet(page).getByRole("button", {name: "Mark as read"}).click();
            await page.getByText("Marked question 1 as read").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Everything you can do with Question 1"}).click();
            await sheet(page).getByRole("button", {name: "Hill road"}).waitFor({timeout: SHOWN});
            if (await sheet(page).getByRole("button", {name: "Mark as read"}).count())
                throw new Error("the question still offers Mark as read");
        },
        async "documents sit on the shelf of their collection"(page) {
            await place(page, "Documents");
            await page.getByRole("tab", {name: /^Garden/}).click();
            await page.getByRole("button", {name: "Garden notes"}).waitFor({timeout: SHOWN});
            await page.getByRole("tab", {name: /^Not in a collection/}).click();
            await page.getByRole("button", {name: "Garden notes"}).waitFor({state: "detached", timeout: SHOWN});
        },
        async "lines of a project file go to the agent with a comment"(page) {
            const sent = [];
            await page.route(MESSAGES, (route) => (sent.push(route.request().postDataJSON().brief), route.fallback()));
            await place(page, "Project files");
            await page.getByRole("button", {name: /^roses\.txt/}).click();
            await page.getByRole("button", {name: "Line 2"}).click();
            await page.getByRole("button", {name: "Ask the agent about line 2"}).click();
            await sheet(page).getByLabel("Your comment").fill("Why white?");
            await sheet(page).getByRole("button", {name: "Send to the agent"}).click();
            await page.getByText("Sent to the agent; the file itself is unchanged").waitFor({timeout: SHOWN});
            if (
                !sent.some(
                    (brief) =>
                        brief.startsWith("About roses.txt, line 2:") && brief.includes("> White roses") && brief.endsWith("Why white?")
                )
            )
                throw new Error(`the agent was sent: ${JSON.stringify(sent)}`);
        },
        async "an environment is made and renamed on the phone"(page) {
            await place(page, "Environments");
            await page.getByRole("button", {name: "New environment"}).click();
            await sheet(page).getByLabel("Name").fill("shed");
            await sheet(page).getByRole("button", {name: "Make it"}).click();
            await page.getByRole("button", {name: /^shed/}).click();
            await sheet(page)
                .getByRole("button", {name: /^Rename/})
                .click();
            await sheet(page).getByLabel("New name").fill("barn");
            await sheet(page).getByRole("button", {name: "Rename", exact: true}).click();
            await page.getByText("Renamed shed to barn").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: /^barn/}).waitFor({timeout: SHOWN});
        },
        async "the journals page says what needs you in each environment"(page) {
            await place(page, "Journals");
            await page
                .getByText(/· \d+ need you/)
                .first()
                .waitFor({timeout: SHOWN});
            await page
                .getByText(/3 questions/)
                .first()
                .waitFor();
        },
        async "an empty organization asks the agent to draft one"(page) {
            await place(page, "Organization");
            await page.getByRole("button", {name: "Ask the agent to draft one"}).click();
            await page.getByText("Asked the agent to draft it").waitFor({timeout: SHOWN});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
