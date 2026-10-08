import {journal, numberOf, runScenarios, shot} from "./harness.mjs";

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
        journal("plan", "start", String(handed));
        journal("plan", "start", String(mine));
        await page.goto(url);
        await bar(page, `Mine ${stamp}`).waitFor();
        await bar(page, `Handed ${stamp}`).waitFor();
        await bar(page, `Mine ${stamp}`).getByText("0/1").waitFor();
        await bar(page, `Handed ${stamp}`).getByText("0/1").waitFor();
        await bar(page, `Mine ${stamp}`).getByRole("button", {name: /^Delegated/}).waitFor({state: "detached"});
        await bar(page, `Handed ${stamp}`).getByRole("button", {name: "Delegated"}).click();
        await page.getByText("No helper has been handed this phase yet. Delegated plans keep running beside the one the agent works.").waitFor();
        await shot(page, "plan-bars-delegated");
    },
    async "from four active plans on, three show and the rest fold into a count"(page, url) {
        const stamp = Date.now();
        for (const name of ["One", "Two", "Three", "Four"]) {
            const plan = readyPlan(`${name} ${stamp}`);
            await approve(page, url, plan);
            journal("plan", "delegate", String(plan));
        }
        await page.goto(url);
        await page.locator(".planmore", {hasText: /\+\d+ more active plans?/}).waitFor();
        if ((await page.locator(".planbar").count()) !== 3) throw new Error("more than three plan bars show");
        if (await page.locator(".planbar .planmore").count()) throw new Error("the fold line sits inside a bar");
        await shot(page, "plan-bars-folded");
        await page.locator(".planmore").click();
        await page.getByText("Other plans").waitFor();
    },
});
