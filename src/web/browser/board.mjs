import {drag, journal, numberOf, reply, runScenarios, shot} from "./harness.mjs";

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
    async "a plan shows the helper that holds each phase and to-do, with its state, and opens its inspector"(page, url) {
        const row = numberOf(journal("todo", "create", `Held row ${Date.now()}`, "--brief", "x"));
        const plan = numberOf(journal("plan", "create", `Held plan ${Date.now()}`, "--set", "goal=something true"));
        journal("plan", "phase", String(plan), "Build", "--when", "it is built");
        journal("plan", "stage", String(plan), "todos");
        journal("plan", "todos", String(plan), "1", String(row));
        journal("todo", "assign", String(row), "helper:7");
        const helper = {n: 7, ref: "helper:7", type: "helper", title: "Build the page", completed: 0, deleted: 0, seen: [], refs: [], state: "working",
            data: {name: "Zed Builder", environment: "zed-env", provider: "claude", model: "sonnet"}};
        await page.route(/\/api\/main\/helper\?/, (route) => reply(route, {rows: [helper]}));
        await page.goto(`${url}#/main/plan/${plan}`);
        const tags = page.locator(".holder", {hasText: "Zed Builder"});
        await tags.first().waitFor();
        if ((await tags.count()) !== 2) throw new Error("the phase and its to-do should each name the helper that holds them");
        if (!(await tags.first().innerText()).includes("Working")) throw new Error("the helper's state is not shown");
        await shot(page, "plan-holders");
        await tags.first().click();
        await page.locator(".agent-inspector").waitFor();
        await shot(page, "plan-holder-inspector");
    },
    async "a plan opened from another page shows its helpers at once, without waiting for the next poll"(page, url) {
        const row = numberOf(journal("todo", "create", `Quick row ${Date.now()}`, "--brief", "x"));
        const plan = numberOf(journal("plan", "create", `Quick plan ${Date.now()}`, "--set", "goal=something true"));
        journal("plan", "phase", String(plan), "Build", "--when", "it is built");
        journal("plan", "stage", String(plan), "todos");
        journal("plan", "todos", String(plan), "1", String(row));
        journal("todo", "assign", String(row), "helper:8");
        const helper = {n: 8, ref: "helper:8", type: "helper", title: "Build fast", completed: 0, deleted: 0, seen: [], refs: [], state: "working",
            data: {name: "Quinn Quick", environment: "quinn-env", provider: "claude", model: "sonnet"}};
        await page.route(/\/api\/main\/helper\?/, (route) => reply(route, {rows: [helper]}));
        await page.goto(`${url}#/main`);
        await page.waitForTimeout(1000);
        await page.evaluate((n) => (window.location.hash = `#/main/plan/${n}`), plan);
        await page.locator(".holder", {hasText: "Quinn Quick"}).first().waitFor({timeout: 1500});
    },
});
