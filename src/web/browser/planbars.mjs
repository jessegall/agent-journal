import {journal, numberOf, runScenarios} from "./harness.mjs";

function readyPlan(title) {
    const row = numberOf(journal("todo", "create", `${title} row`, "--brief", "x"));
    const plan = numberOf(journal("plan", "create", title, "--set", "goal=something true"));
    journal("plan", "phase", String(plan), "First", "--when", "it is done");
    journal("plan", "stage", String(plan), "todos");
    journal("plan", "todos", String(plan), "1", String(row));
    journal("plan", "ready", String(plan));
    return plan;
}

async function approve(page, url, plan) {
    await page.goto(`${url}#/main/plan/${plan}`);
    await page.getByRole("button", {name: "Approve", exact: true}).click();
    await page.getByRole("button", {name: "Approve", exact: true}).waitFor({state: "detached"});
}

const bar = (page, title) => page.locator(".planbar", {hasText: title});

await runScenarios(process.argv[2], {
    async "a delegated plan has a bar of its own with a teal tag that opens its helpers"(page, url) {
        const stamp = Date.now();
        const mine = readyPlan(`Mine ${stamp}`);
        const handed = readyPlan(`Handed ${stamp}`);
        await approve(page, url, mine);
        await approve(page, url, handed);
        journal("plan", "delegate", String(handed));
        await page.goto(url);
        await bar(page, `Mine ${stamp}`).waitFor();
        await bar(page, `Handed ${stamp}`).waitFor();
        await bar(page, `Mine ${stamp}`).getByRole("button", {name: /^With helper/}).waitFor({state: "detached"});
        await bar(page, `Handed ${stamp}`).getByRole("button", {name: /^With helper/}).click();
        await page.getByText("Helpers working on this phase").waitFor();
        await page.locator(".planbar-delegated", {hasText: `Handed ${stamp}`}).waitFor();
    },
    async "from four active plans on, three show and the rest fold into a count"(page, url) {
        const stamp = Date.now();
        for (const name of ["One", "Two", "Three", "Four"]) {
            const plan = readyPlan(`${name} ${stamp}`);
            await approve(page, url, plan);
            journal("plan", "delegate", String(plan));
        }
        await page.goto(url);
        await page.getByRole("button", {name: /\+\d+ more active plans?/}).waitFor();
        if ((await page.locator(".planbar").count()) !== 3) throw new Error("more than three plan bars show");
    },
});
