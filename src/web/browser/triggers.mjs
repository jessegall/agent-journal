import {journal, numberOf, runScenarios} from "./harness.mjs";

const WATCH = "When something in the journal is true";
const row = (page, title) => page.locator(".row-wrap", {hasText: title}).first();
const option = (scope, label) => scope.getByRole("option").filter({hasText: new RegExp(`^\\s*${label}`)}).first();
const menu = async (page, title, word) => {
    await row(page, title).getByRole("button", {name: /Actions for/}).click();
    await page.locator(".menu-panel button", {hasText: word}).first().click();
};

await runScenarios(process.argv[2], {
    async "a trigger on a fact is made, edited, retired and deleted in the viewer"(page, url) {
        const title = `Answer waiting ${Date.now()}`;
        await page.goto(`${url}#/main/trigger`);
        await page.getByRole("button", {name: /^New trigger/}).click();
        const dialog = page.getByRole("dialog", {name: "New trigger"});
        await option(dialog, WATCH).click();
        await option(dialog, "The agent has been idle").click();
        await dialog.getByPlaceholder(/Name it/).fill(title);
        await dialog.getByPlaceholder(/Name it/).press("Enter");
        await dialog.locator("textarea").fill("Check your messages, {{minutes}} minutes have passed.");
        await dialog.locator("textarea").blur();
        await dialog.getByRole("button", {name: "Create trigger"}).click();
        await dialog.waitFor({state: "detached"});
        const panel = page.locator("main, .side-panel, body").first();
        await panel.getByText("When the agent has been idle for more than 5 minutes").first().waitFor();
        const fact = await option(page, "The agent has been idle").getAttribute("aria-selected");
        if (fact !== "true") throw new Error("the saved trigger did not show the fact it watches");
        await option(page, "A question has no answer").click();
        await panel.getByText("When a question has had no answer for more than 5 minutes").first().waitFor();
        await option(page, "Hold the agent's writes").click();
        await panel.getByText("hold the agent's writes").first().waitFor();
        if (await option(page, "Block a command or file change").count()) throw new Error("a trigger on a fact offered to block a command");
        const saved = journal("trigger", "all", "--last", "0");
        if (!saved.includes(title)) throw new Error("the trigger made in the viewer was not stored");
        await page.waitForFunction(() => document.body.innerText.includes("Hold the agent's writes"));
        await page.locator(".veil").first().click({position: {x: 4, y: 4}});
        await page.locator(".veil").first().waitFor({state: "detached"});
        await menu(page, title, "Close the trigger");
        await row(page, title).waitFor({state: "detached"});
    },
    async "a trigger on a fact is deleted from the list"(page, url) {
        const title = `Delete me ${Date.now()}`;
        const made = numberOf(journal("trigger", "create", title, "--set", "when=state", "--set", "fact=agent.idle", "--set", "over=10", "--set", "does=nudge", "--set", "text=Look at {{title}}"));
        await page.goto(`${url}#/main/trigger`);
        await row(page, title).waitFor();
        await menu(page, title, "Delete");
        await page.getByRole("button", {name: "Delete it"}).click();
        await row(page, title).waitFor({state: "detached"});
        if (!made) throw new Error("the trigger was not made");
    },
});
