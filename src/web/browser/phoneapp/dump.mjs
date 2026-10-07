import {runScenarios} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN, tab} from "./paired.mjs";

const state = await pairedState();
const NOTES = [
    {name: "roses.txt", mimeType: "text/plain", buffer: Buffer.from("Red roses need sun\n")},
    {name: "tulips.txt", mimeType: "text/plain", buffer: Buffer.from("Tulips go in before winter\n")},
];

await runScenarios(
    PAIR,
    {
        async "many files are sent as one dump and the agent's sorting shows"(page) {
            await home(page);
            await tab(page, "Everything");
            await page.getByRole("button", {name: /^Dumps/}).click();
            await page.getByLabel("Files to send").setInputFiles(NOTES);
            await page.getByText("Files · 2").waitFor({timeout: SHOWN});
            await page.getByLabel("Notes for the agent").fill("Garden notes from the weekend");
            await page.getByRole("button", {name: "Send to the agent to sort"}).click();
            await page.getByText("Files · 0 of 3 done").waitFor({timeout: SHOWN});
            await page.getByText("tulips.txt").first().waitFor();
            await page.getByRole("button", {name: "Tell the agent how to sort"}).click();
            await page.getByRole("dialog").getByRole("textbox").fill("One document per flower");
            await page.getByRole("dialog").getByRole("button", {name: "Send", exact: true}).click();
            await page.getByText("Sent to the agent").waitFor({timeout: SHOWN});
        },
        async "picking several files in the chat offers to send them as a dump"(page) {
            await home(page);
            await page.locator("form.compose input[type=file]").setInputFiles(NOTES);
            await page.getByText("2 files. Send as a dump instead?").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Send as a dump"}).click();
            await page.getByText("Files · 2").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Send to the agent to sort"}).click();
            await page.getByText("Files · 0 of 2 done").waitFor({timeout: SHOWN});
        },
        async "a dump being sorted shows above the chat and opens"(page) {
            await home(page);
            await page.getByRole("button", {name: /, filing\. Open it$/}).click();
            await page.getByText(/^Files · \d+ of \d+ done$/).waitFor({timeout: SHOWN});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
