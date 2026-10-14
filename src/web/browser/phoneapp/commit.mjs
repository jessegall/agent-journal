import {runScenarios} from "../harness.mjs";
import {home, PAIR, PHONE, pairedState, SHOWN} from "./paired.mjs";

const ROSES = 4;
const state = await pairedState();

async function opened(page, target) {
    await page.goto(new URL(`./#open=${encodeURIComponent(target)}`, PAIR).href);
}

await runScenarios(
    PAIR,
    {
        async "a commit named in a message opens its commit screen"(page) {
            await home(page);
            await page.locator("[data-hold]", {hasText: "The roses went in"}).locator("a[data-commit]").click();
            await page.getByRole("heading", {name: "write roses.txt"}).waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: /^roses\.txt/}).waitFor();
        },
        async "a to-do lists the files its work changed and opens its commit"(page) {
            await opened(page, `todo:${ROSES}`);
            await page.getByText("Files changed · 1").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: /^roses\.txt.*\+3 −0/}).waitFor();
            await page.getByRole("button", {name: /^write roses\.txt/}).click();
            await page.getByRole("heading", {name: "write roses.txt"}).waitFor({timeout: SHOWN});
        },
        async "a file in a commit opens the project file"(page) {
            await home(page);
            await page.locator("[data-hold]", {hasText: "The roses went in"}).locator("a[data-commit]").click();
            await page.getByRole("button", {name: /^roses\.txt/}).click();
            await page.getByText("White roses").waitFor({timeout: SHOWN});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
