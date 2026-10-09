import {journal, numberOf, reply, runScenarios, shot} from "./harness.mjs";

function readyPlan(title) {
    const row = numberOf(journal("todo", "create", `${title} row`, "--brief", "x"));
    const plan = numberOf(journal("plan", "create", title, "--set", "goal=something true"));
    journal("plan", "phase", String(plan), "First", "--when", "it is done");
    journal("plan", "stage", String(plan), "todos");
    journal("plan", "todos", String(plan), "1", String(row));
    journal("plan", "ready", String(plan));
    return plan;
}

async function approve(page, url, plan, title) {
    await page.goto(`${url}#/main/plan/${plan}`);
    const approve = page.locator("article.plan", {hasText: title}).getByRole("button", {name: "Approve", exact: true});
    await approve.click();
    await approve.waitFor({state: "detached"});
}

const bar = (page, title) => page.locator(".planbar", {hasText: title});

await runScenarios(process.argv[2], {
    async "a delegated plan has a bar of its own with a teal tag that opens its helpers"(page, url) {
        const stamp = Date.now();
        const mine = readyPlan(`Mine ${stamp}`);
        const handed = readyPlan(`Handed ${stamp}`);
        try {
            await approve(page, url, mine, `Mine ${stamp}`);
            await approve(page, url, handed, `Handed ${stamp}`);
            journal("plan", "delegate", String(handed));
            journal("plan", "start", String(handed));
            journal("plan", "start", String(mine));
            await page.goto(url);
            await bar(page, `Mine ${stamp}`).waitFor();
            await bar(page, `Handed ${stamp}`).waitFor();
            await bar(page, `Mine ${stamp}`).getByText("0/1").waitFor();
            await bar(page, `Handed ${stamp}`).getByText("0/1").waitFor();
            await bar(page, `Mine ${stamp}`).getByRole("button", {name: /^Delegated/}).waitFor({state: "detached"});
            if (await bar(page, `Handed ${stamp}`).getByText(/^With /).count()) throw new Error("the plan bar's tag still reads like a sentence instead of a label");
            await bar(page, `Handed ${stamp}`).getByRole("button", {name: "Delegated"}).click();
            await page.getByText("No helper has been handed this phase yet. Delegated plans keep running beside the one the agent works.").waitFor();
            await shot(page, "plan-bars-delegated");
        } finally {
            for (const plan of [mine, handed]) journal("plan", "abandon", String(plan), "--why", "the scenario is over");
        }
    },
    async "from four active plans on, three show and the rest fold into a count"(page, url) {
        const stamp = Date.now();
        for (const name of ["One", "Two", "Three", "Four"]) {
            const title = `${name} ${stamp}`;
            const plan = readyPlan(title);
            await approve(page, url, plan, title);
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
    async "a helper pill stays inside its phase card beside one row, beside a group and on a phone"(page, url) {
        const stamp = Date.now();
        const helper = (n, name, report) => ({n, type: "helper", title: name, completed: 0, created: 1, data: {name, provider: "codex", model: "gpt-6-sol", environment: `main-${n}`, report}});
        const helpers = [helper(91, "Florence Nightingale of the Very Long Ward Rounds", "done"), helper(92, "Gerardus Mercator", "")];
        const rows = [1, 2, 3, 4].map((i) => numberOf(journal("todo", "create", `Pill row ${i} ${stamp}`, "--brief", "x")));
        const plan = numberOf(journal("plan", "create", `Pills ${stamp}`, "--set", "goal=pills stay inside"));
        journal("plan", "phase", String(plan), "First", "--when", "every pill is inside");
        journal("plan", "stage", String(plan), "todos");
        journal("plan", "todos", String(plan), "1", ...rows.map(String));
        journal("plan", "ready", String(plan));
        journal("todo", "assign", String(rows[0]), "helper:91");
        journal("todo", "assign", String(rows[1]), "helper:92");
        journal("todo", "assign", String(rows[2]), "helper:92");
        await page.route(/\/api\/main\/helper\?/, (route) => reply(route, {rows: helpers}));
        try {
            for (const size of [{width: 1280, height: 900}, {width: 390, height: 844}]) {
                await page.setViewportSize(size);
                await page.goto(`${url}#/main/plan/${plan}`);
                await page.locator(".held-tag .holder").nth(1).waitFor();
                const outside = await page.evaluate(() => {
                    const card = document.querySelector(".phase").getBoundingClientRect();
                    return [...document.querySelectorAll(".phase .holder")].filter((pill) => pill.getBoundingClientRect().right > card.right).length;
                });
                if (outside) throw new Error(`${outside} helper pills stick out of the phase card at ${size.width}px`);
                await shot(page, `plan-pills-${size.width}`);
            }
        } finally {
            journal("plan", "abandon", String(plan), "--why", "the scenario is over");
        }
    },
});
