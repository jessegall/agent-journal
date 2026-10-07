import {drag, journal, numberOf, runScenarios} from "./harness.mjs";

const card = (page, title) => page.locator(".card", {hasText: title});
const lane = (page, title) => page.locator(".lane", {has: page.locator(".title", {hasText: new RegExp(`^${title}$`)})});

async function why(page, question, words, asked = true) {
    const dialog = page.getByRole("dialog", {name: question});
    if (!asked && !(await dialog.waitFor({timeout: 2000}).then(() => true, () => false))) return;
    if (words) await dialog.getByRole("textbox").fill(words);
    await dialog.getByRole("button", {name: "Move"}).click();
}

async function openBoard(page, url) {
    await page.goto(`${url}#/main/kanban`);
    const back = page.getByRole("button", {name: /Back to the board/});
    if (await back.waitFor({timeout: 3000}).then(() => true, () => false)) await back.click();
    await page.getByRole("tab", {name: "To-dos"}).click();
}

await runScenarios(process.argv[2], {
    async "a card dragged to another lane stays there after a reload"(page, url) {
        const title = `Drag me ${Date.now()}`;
        journal("todo", "create", title, "--brief", "to drag");
        await openBoard(page, url);
        await lane(page, "To do").locator(".card", {hasText: title}).waitFor();
        await drag(page, card(page, title), lane(page, "Held"));
        await why(page, "Why is it blocked?", "waiting on a part");
        await lane(page, "Held").locator(".card", {hasText: title}).waitFor();
        await page.reload();
        await page.getByRole("tab", {name: "To-dos"}).click();
        await lane(page, "Held").locator(".card", {hasText: title}).waitFor();
    },
    async "a card moved from its menu says so and the move can be undone"(page, url) {
        const title = `Menu me ${Date.now()}`;
        journal("todo", "create", title, "--brief", "to move");
        await openBoard(page, url);
        await card(page, title).hover();
        await card(page, title).focus();
        await page.keyboard.press("m");
        await page.getByText("Move to").waitFor();
        await page.getByText("Held", {exact: true}).last().click();
        await why(page, "Why is it blocked?", "waiting on a part");
        await page.getByText(/Moved #\d+ to Held/).waitFor();
        await lane(page, "Held").locator(".card", {hasText: title}).waitFor();
        await page.getByRole("button", {name: "Undo"}).click();
        if (await page.getByRole("dialog", {name: "Why reopen it?"}).waitFor({timeout: 2000}).then(() => true, () => false)) await why(page, "Why reopen it?", "the part came");
        await lane(page, "To do").locator(".card", {hasText: title}).waitFor();
    },
    async "a move the server refuses is reported and the card goes back"(page, url) {
        const title = `Refuse me ${Date.now()}`;
        journal("todo", "create", title, "--brief", "to refuse");
        await openBoard(page, url);
        await lane(page, "To do").locator(".card", {hasText: title}).waitFor();
        await page.route(/\/api\/main\/todo\/\d+\//, (route) => route.request().method() !== "POST" ? route.fallback() : route.fulfill({status: 409, contentType: "application/json", body: JSON.stringify({error: "no move today"})}));
        await drag(page, card(page, title), lane(page, "Held"));
        await why(page, "Why is it blocked?", "waiting on a part");
        await page.getByText(/no move today/).waitFor();
        await lane(page, "To do").locator(".card", {hasText: title}).waitFor();
    },
    async "a plan that is ready is approved from its page and stays approved after a reload"(page, url) {
        const row = numberOf(journal("todo", "create", `Plan row ${Date.now()}`, "--brief", "x"));
        const plan = numberOf(journal("plan", "create", `Plan ${Date.now()}`, "--set", "goal=something true"));
        journal("plan", "phase", String(plan), "First", "--when", "it is done");
        journal("plan", "stage", String(plan), "todos");
        journal("plan", "todos", String(plan), "1", String(row));
        journal("plan", "ready", String(plan));
        await page.goto(`${url}#/main/plan/${plan}`);
        await page.getByRole("button", {name: "Approve", exact: true}).click();
        await page.getByRole("button", {name: "Approve", exact: true}).waitFor({state: "detached"});
        await page.reload();
        await page.getByText(/approved/i).first().waitFor();
        if (await page.getByRole("button", {name: "Approve", exact: true}).count()) throw new Error("the plan asks for approval again after a reload");
    },
});
