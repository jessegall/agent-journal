import {journal, numberOf, runScenarios} from "./harness.mjs";

const mode = (page, name) => page.locator("[role=radio]", {hasText: name});
const selector = (page) => page.locator(".new-work-board");

await runScenarios(process.argv[2], {
    async "orchestrator mode picks the board new work goes to, and None sends it back to to-dos"(page, url) {
        const title = `Rewrite ${Date.now()}`;
        numberOf(journal("board", "create", title, "--set", "stages=Doing,Done"));
        await page.goto(`${url}#/main`);
        await mode(page, "Builder").click();
        await selector(page).waitFor({state: "detached"});
        await mode(page, "Orchestrator").click();
        await selector(page).getByRole("button", {name: "None"}).click();
        await page.getByText(title, {exact: true}).click();
        await selector(page).getByRole("button", {name: title}).waitFor();
        await page.reload();
        await selector(page).getByRole("button", {name: title}).waitFor();
        await selector(page).getByRole("button", {name: title}).click();
        await page.getByText("None", {exact: true}).click();
        await selector(page).getByRole("button", {name: "None"}).waitFor();
    },
});
