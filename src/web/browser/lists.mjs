import {journal, numberOf, runScenarios, shot} from "./harness.mjs";

const CLOSED = 30;
const RULES = 30;

const looked = async (page, name) => {
    await page.getByRole("button", {name: "Load more"}).scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);
    await shot(page, name);
};

await runScenarios(process.argv[2], {
    async "a list of closed rows counts all of them and loads the rest with its button"(page, url) {
        for (let i = 0; i < CLOSED; i++) {
            const n = numberOf(journal("todo", "create", `Closed row ${i} of ${Date.now()}`));
            journal("todo", "done", String(n), "--how", "finished");
        }
        await page.goto(`${url}#/main/todo?sub=closed`);
        await page.getByText(/^Showing \d+ of \d+$/).waitFor();
        const total = Number((await page.getByText(/^Showing \d+ of \d+$/).textContent()).split(" of ")[1]);
        if (total < CLOSED) throw new Error(`the list counts ${total} closed rows, fewer than the ${CLOSED} made`);
        await page.locator(".gcount", {hasText: String(total)}).first().waitFor();
        await looked(page, "closed-todos-before");
        await page.getByRole("button", {name: "Load more"}).click();
        await page.waitForFunction((all) => document.querySelectorAll(".row-wrap").length >= all, total);
        await shot(page, "closed-todos-after");
    },
    async "the rules list counts every rule and loads the rest with its button"(page, url) {
        for (let i = 0; i < RULES; i++) journal("rule", "create", `Scenario rule ${i} of ${Date.now()}`, "--set", "keywords=scenario");
        await page.goto(`${url}#/main/rule`);
        await page.getByText(/^Showing \d+ of \d+$/).waitFor();
        const total = Number((await page.getByText(/^Showing \d+ of \d+$/).textContent()).split(" of ")[1]);
        if (total < RULES) throw new Error(`the list counts ${total} rules, fewer than the ${RULES} made`);
        await looked(page, "rules-before");
        await page.getByRole("button", {name: "Load more"}).click();
        await page.waitForFunction((all) => document.querySelectorAll(".row-wrap").length >= all, total);
        await shot(page, "rules-after");
    },
});
