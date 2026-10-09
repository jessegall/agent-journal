import {runScenarios, shot} from "./harness.mjs";

const HOUR_AND_BIT = 3725;

const fakeAgent = (number) => ({
    name: `ticket-${number}`,
    owner: `ticket:${number}`,
    agent: {status: "running", at: Date.now() / 1000, model: "opus", provider: "claude"},
    work: {n: number, title: `Build part ${number}`, todo: 0, parked: false, awaiting: "", completed: 0, created: Date.now() / 1000 - HOUR_AND_BIT},
    counts: {},
    plans: [],
    subagents: [],
});

await runScenarios(process.argv[2], {
    async "each agent keeps a cell by its number and shows how long it has been on its job"(page, url) {
        await page.route(/\/api\/summary/, async (route) => {
            const response = await route.fetch();
            const body = await response.json();
            await route.fulfill({response, json: {...body, environments: [...(body.environments || []), fakeAgent(9), fakeAgent(2), fakeAgent(5)]}});
        });
        const layout = {tree: {id: 1}, panes: {1: {tabs: ["agents"], active: "agents"}}, next: 2};
        await page.addInitScript((kept) => sessionStorage.setItem("journal.layout.main", kept), JSON.stringify(layout));
        await page.goto(`${url}#/main`);
        await page.locator(".agent-window").nth(2).waitFor();
        const labels = await page.locator(".agent-window .aw-label").allInnerTexts();
        if (labels.join() !== "#2,#5,#9") throw new Error(`the cells are ${labels.join()}, not in number order`);
        const timers = await page.locator(".agent-window .job-timer").allInnerTexts();
        if (timers.length !== 3 || !timers.every((time) => /^1h 02m \d\ds$/.test(time))) throw new Error(`the timers read ${timers.join()}`);
        const starts = await page.locator(".agent-window").first().locator(".aw-line > :nth-child(2)").evaluateAll((values) => values.map((value) => Math.round(value.getBoundingClientRect().x)));
        if (starts.length < 2 || new Set(starts).size !== 1) throw new Error(`the values of a cell's rows start at ${starts.join(", ")}, not at one x`);
        await page.locator(".project-flash").waitFor({state: "detached"});
        await shot(page, "agent-cells");
    },
});
