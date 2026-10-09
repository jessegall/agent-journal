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
    async "the Closed bar in the helpers list runs edge to edge and folds the closed helpers until pressed"(page, url) {
        const closed = {...helper, n: 92, title: "Old job", completed: 5, state: "finished", data: {...helper.data, name: "Ada Keywright", environment: "main-ada"}};
        await page.route(/\/api\/main\/helper\?/, (route) => reply(route, {rows: [helper, closed]}));
        await page.goto(url);
        await page.locator(".statusbar-helpers").click();
        const bar = page.getByRole("button", {name: /^Closed/});
        await bar.waitFor();
        if (await page.getByText("Ada Keywright").count()) throw new Error("the closed helpers show before the Closed bar is pressed");
        const panel = await page.locator(".menu-panel").last().boundingBox();
        const box = await bar.boundingBox();
        if (Math.abs(box.x - panel.x) > 2 || Math.abs(box.x + box.width - (panel.x + panel.width)) > 2) throw new Error(`the Closed bar spans ${box.x}-${box.x + box.width}, not the popover's ${panel.x}-${panel.x + panel.width}`);
        await bar.click();
        await page.getByText("Ada Keywright").waitFor();
        await shot(page, "helpers-closed-bar");
    },
});
