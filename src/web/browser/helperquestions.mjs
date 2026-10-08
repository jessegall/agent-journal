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
});
