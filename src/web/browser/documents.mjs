import {journal, numberOf, runScenarios} from "./harness.mjs";

const make = (title, brief) => numberOf(journal("doc", "create", title, "--abstract", `About ${title}`, "--brief", brief));
const library = async (page, url) => {
    await page.goto(`${url}#/main/doc`);
    await page.getByPlaceholder(/Search titles/).waitFor();
};
const read = async (page, title) => {
    await page.getByPlaceholder(/Search titles/).fill(title);
    await page.locator(".row-wrap", {hasText: title}).first().click();
};

await runScenarios(process.argv[2], {
    async "a document being written says so in the library and when read"(page, url) {
        const title = `Draft ${Date.now()}`;
        const n = make(title, "unfinished");
        journal("doc", "draft", String(n));
        await library(page, url);
        await page.getByPlaceholder(/Search titles/).fill(title);
        await page.locator(".row-wrap", {hasText: title}).getByText("Still being written").waitFor();
        await read(page, title);
        await page.waitForFunction(() => document.body.innerText.split("Still being written").length > 2);
    },
    async "a document replaced by a newer one says which, and the newer one is not marked replaced"(page, url) {
        const stamp = Date.now();
        const old = make(`Old guide ${stamp}`, "old");
        const fresh = make(`New guide ${stamp}`, "new");
        journal("doc", "supersede", String(old), String(fresh));
        await library(page, url);
        await read(page, `Old guide ${stamp}`);
        await page.getByText(`Replaced by doc ${fresh}`).first().waitFor();
        await read(page, `New guide ${stamp}`);
        await page.getByText(`Doc ${fresh} is the newer version`).first().waitFor({state: "detached", timeout: 3000}).catch(() => {
            throw new Error("the newer document is marked as replaced");
        });
    },
    async "a library with nothing matching the search says so instead of staying empty"(page, url) {
        make(`Findable ${Date.now()}`, "something");
        await library(page, url);
        await page.getByPlaceholder(/Search titles/).fill("zzqqxx-no-such-words");
        await page.getByText(/no documents|nothing|No match|No documents/i).first().waitFor();
    },
    async "a search finds a document by words inside it and shows where"(page, url) {
        const word = `needleword${Date.now()}`;
        const n = make(`Haystack ${Date.now()}`, `A brief that mentions ${word} in passing`);
        journal("doc", "section", String(n), "Details", `Body text with ${word} inside`);
        await library(page, url);
        await page.getByPlaceholder(/Search titles/).fill(word);
        await page.locator(".row-wrap", {hasText: "Details"}).first().waitFor();
    },
});
