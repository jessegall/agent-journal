import {runScenarios} from "../harness.mjs";
import {allowRuns, home, openPlace, PAIR, pairedState, PHONE, SHOWN, tab} from "./paired.mjs";

const state = await pairedState();
const sheet = (page) => page.getByRole("dialog");
const row = (page, name) => page.getByRole("button", {name, exact: true});

async function todos(page) {
    await home(page);
    await tab(page, "To-dos");
    await row(page, "Paint the shed").waitFor({timeout: SHOWN});
}

async function drag(page, locator, dx, hold = 0) {
    const box = await locator.boundingBox();
    const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
    await page.mouse.move(x, y);
    await page.mouse.down();
    if (hold) await page.waitForTimeout(hold);
    for (let step = 1; step <= 8; step++) await page.mouse.move(x + (dx * step) / 8, y);
    await page.mouse.up();
}

await runScenarios(
    PAIR,
    {
        async "a to-do row swiped left shows Start, Block and More"(page) {
            await todos(page);
            await drag(page, row(page, "Paint the shed"), -200);
            await page.getByRole("button", {name: "Start"}).first().waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Block"}).first().waitFor();
            await page.getByRole("button", {name: "More"}).first().waitFor();
        },
        async "a to-do row held opens everything it can do"(page) {
            await todos(page);
            const box = await row(page, "Paint the shed").boundingBox();
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await page.waitForTimeout(700);
            await page.mouse.up();
            await sheet(page).getByRole("button", {name: /^Open/}).waitFor({timeout: SHOWN});
        },
        async "the board shows its lanes and makes a new board"(page) {
            await todos(page);
            await page.getByRole("radio", {name: "Board"}).click();
            await page.getByText("Paint the shed").first().waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Board settings"}).click();
            await sheet(page).getByRole("button", {name: /^Make a new board/}).click();
            await sheet(page).getByRole("radio", {name: "Roadmap"}).click();
            await sheet(page).getByText("Ideas · Planned · Building · Shipped").waitFor({timeout: SHOWN});
            await sheet(page).getByLabel("Name").fill("Herb beds");
            await sheet(page).getByRole("button", {name: "Create board"}).click();
            await page.getByText(/^Created board/).waitFor({timeout: SHOWN});
        },
        async "a plan asks for a review with a critique template and shows its timeline"(page) {
            await openPlace(page, "Plans");
            await page.getByRole("button", {name: /Keep the garden/}).first().click();
            await page.getByRole("button", {name: "Ask for a review"}).click();
            await page.getByText("Template", {exact: true}).waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Ask for the review"}).waitFor();
            await page.getByRole("button", {name: /^Timeline/}).click();
            await page.getByRole("heading", {name: "Timeline"}).waitFor({timeout: SHOWN});
            await page.getByText(/Nothing yet|#1 Water the plants/).first().waitFor({timeout: SHOWN});
        },
        async "a document with versions steps back to an earlier one"(page) {
            await openPlace(page, "Documents");
            await page.getByRole("button", {name: /Garden notes/}).first().click();
            await page.getByLabel("Versions").waitFor({timeout: SHOWN});
            await page.getByRole("button", {name: "Earlier version"}).click();
            await page.getByText(/^Version 1 of/).waitFor({timeout: SHOWN});
        },
        async "a document's share sheet lists its links and stops them"(page) {
            await openPlace(page, "Documents");
            await page.getByRole("button", {name: /Garden notes/}).first().click();
            await page.getByRole("button", {name: /^More/}).click();
            await sheet(page).getByRole("button", {name: /^Stop sharing/}).waitFor({timeout: SHOWN});
        },
        async "search finds an item by its words and a place by its name"(page) {
            await openPlace(page, "Search");
            await page.getByLabel("Search places, commands and items").fill("roses");
            await page.getByRole("button", {name: /The roses face south/}).waitFor({timeout: SHOWN});
            await page.getByLabel("Search places, commands and items").fill("environments");
            await page.getByRole("button", {name: /^Environments/}).last().waitFor({timeout: SHOWN});
        },
        async "a sheet with a text area opens at one final height"(page) {
            await todos(page);
            await page.getByRole("button", {name: /^New/}).click();
            const form = sheet(page);
            await form.getByLabel("Title").waitFor({timeout: SHOWN});
            await form.evaluate((el) => Promise.all(el.getAnimations().map((animation) => animation.finished)));
            const opened = (await form.boundingBox()).height;
            await form.getByLabel("Details").fill("A long\nnote\n".repeat(30));
            const typed = (await form.boundingBox()).height;
            if (Math.abs(opened - typed) > 1) throw new Error(`the sheet grew from ${opened} to ${typed}`);
        },
        async "adding a plugin uses the kit field and its Cancel"(page) {
            await allowRuns(page);
            await openPlace(page, "Plugins");
            await page.getByRole("button", {name: "Add a plugin"}).last().click();
            await page.getByRole("button", {name: /Install a plugin/}).click();
            await sheet(page).getByLabel("Where it comes from").fill("/nowhere");
            await sheet(page).getByRole("button", {name: "Cancel"}).click();
            await sheet(page).waitFor({state: "detached"});
        },
    },
    {voice: false, device: {...PHONE, storageState: state}}
);
