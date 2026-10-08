import {journal, numberOf, runScenarios} from "./harness.mjs";

const CLOSED = 30;

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
        await page.getByRole("button", {name: "Load more"}).click();
        await page.waitForFunction((all) => document.querySelectorAll(".row-wrap").length >= all, total);
    },
});
