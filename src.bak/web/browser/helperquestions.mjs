import {reply, runScenarios, shot} from "./harness.mjs";

const QUESTION = "Which port should the server use?";

const helper = {
    n: 91,
    type: "helper",
    title: "Profile the slow start",
    completed: 0,
    created: 1,
    data: {name: "Leslie Lamportson", provider: "codex", model: "gpt-6-sol", environment: "main-leslie-lamportson", report: ""},
};

await runScenarios(process.argv[2], {
    async "a helper that waits on a question shows it in the helpers list"(page, url) {
        await page.route(/\/api\/main\/helper\?/, (route) => reply(route, {rows: [helper]}));
        await page.route(/\/api\/summary/, async (route) => {
            const got = await (await route.fetch()).json();
            const asking = {name: helper.data.environment, owner: `helper:${helper.n}`, attention: {kind: "question", text: QUESTION}};
            return reply(route, {...got, helpers: [asking]});
        });
        await page.goto(url);
        await page.locator(".statusbar-helpers").click();
        const row = page.locator(".helper", {hasText: "Leslie Lamportson"});
        await row.getByText("Asks a question").waitFor();
        await row.getByText(QUESTION).waitFor();
        await shot(page, "helper-question");
    },
    async "the Retired bar in the helpers list runs edge to edge and folds the retired helpers until pressed"(page, url) {
        const closed = {...helper, n: 92, title: "Old job", completed: 5, state: "finished", data: {...helper.data, name: "Ada Keywright", environment: "main-ada"}};
        await page.route(/\/api\/main\/helper\?/, (route) => reply(route, {rows: [helper, closed]}));
        await page.goto(url);
        await page.locator(".statusbar-helpers").click();
        const bar = page.getByRole("button", {name: /^Retired/});
        await bar.waitFor();
        if (await page.getByText("Ada Keywright").count()) throw new Error("the retired helpers show before the Retired bar is pressed");
        const panel = await page.locator(".menu-panel").last().boundingBox();
        const box = await bar.boundingBox();
        if (Math.abs(box.x - panel.x) > 2 || Math.abs(box.x + box.width - (panel.x + panel.width)) > 2) throw new Error(`the Retired bar spans ${box.x}-${box.x + box.width}, not the popover's ${panel.x}-${panel.x + panel.width}`);
        await bar.click();
        await page.getByText("Ada Keywright").waitFor();
        await shot(page, "helpers-closed-bar");
    },
    async "the helpers list sorts helpers into working, waiting, closed and retired, and each says how often it was reused"(page, url) {
        const rows = [
            {...helper, n: 93, title: "Busy job", state: "working", data: {...helper.data, name: "Grace Hopperton", environment: "main-grace"}},
            {...helper, n: 94, title: "Idle job", state: "idle", data: {...helper.data, name: "Edsger Dijkstrap", environment: "main-edsger", reuses: 3}},
            {...helper, n: 95, title: "Stopped job", state: "stopped", data: {...helper.data, name: "Alan Turingale", environment: "main-alan"}},
            {...helper, n: 96, title: "Retired job", completed: 5, state: "finished", data: {...helper.data, name: "Ada Keywright", environment: "main-ada"}},
        ];
        await page.route(/\/api\/main\/helper\?/, (route) => reply(route, {rows}));
        await page.goto(url);
        await page.locator(".statusbar-helpers").click();
        for (const title of ["Working", "Waiting for work", "Closed, can take more work"]) await page.getByRole("heading", {name: title}).waitFor();
        await page.getByText("Reused 3 times").waitFor();
        await page.getByText(/First dispatched/).first().waitFor();
        await page.getByRole("button", {name: /^Retired/}).waitFor();
        await page.locator(".helper", {hasText: "Alan Turingale"}).getByRole("button", {name: "Retire this helper"}).click();
        await page.getByPlaceholder("Why it cannot be reused").waitFor();
        await shot(page, "helpers-sections");
    },
    async "the inspector of a closed helper and of a retired helper both show their transcript"(page, url) {
        const closed = {...helper, n: 97, title: "Stopped job", state: "stopped", data: {...helper.data, name: "Alan Turingale", environment: "main-alan", provider: "claude"}};
        const retired = {...helper, n: 98, title: "Retired job", completed: 5, state: "finished", data: {...helper.data, name: "Ada Keywright", environment: "main-ada", provider: "claude", transcript: "/somewhere/ada.jsonl"}};
        const said = (text) => ({total: 1, first: 1, turns: [{line: 1, who: "agent", kind: "agent", at: 1, tools: [], text, clipped: false}]});
        await page.route(/\/api\/main\/helper\?/, (route) => reply(route, {rows: [closed, retired]}));
        await page.route(/\/api\/main-alan\/agent\?/, (route) =>
            reply(route, {rows: [{n: 5, type: "agent", title: "claude-alan", abstract: "", brief: "", refs: [], seen: [], sections: [], created: 1, updated: 2, deleted: 0, completed: 0, data: {status: "stopped", provider: "claude"}}], more: false})
        );
        await page.route(/\/api\/main-alan\/agent\/5\/transcript/, (route) => reply(route, said("Closed helper said this")));
        await page.route(/\/api\/main\/helper\/98\/transcript/, (route) => reply(route, said("Retired helper said this")));
        await page.goto(url);
        await page.locator(".statusbar-helpers").click();
        await page.getByText("Alan Turingale").first().click();
        await page.getByText("Transcript", {exact: true}).first().click();
        await page.getByText("Closed helper said this").first().waitFor();
        await page.keyboard.press("Escape");
        await page.locator(".statusbar-helpers").click();
        await page.getByRole("button", {name: /^Retired/}).click();
        await page.getByRole("button", {name: "Ada Keywright"}).click();
        await page.getByText("Transcript", {exact: true}).first().click();
        await page.getByText("Retired helper said this").first().waitFor();
        await shot(page, "helpers-transcripts");
    },
});
