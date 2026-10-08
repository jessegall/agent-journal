import {journal, numberOf, runScenarios, shot} from "./harness.mjs";

const SUBAGENT = {session: "sub-1", task: "Check the build", type: "general", running: false, status: "done", skills: []};

function withSubagent(node) {
    if (Array.isArray(node)) return node.forEach(withSubagent);
    if (!node || typeof node !== "object") return;
    if (node.type === "agent" && node.data && !node.data.parent) node.data.subagent_rows = [SUBAGENT];
    Object.values(node).forEach(withSubagent);
}

await runScenarios(process.argv[2], {
    async "a subagent's terminal shows nothing of its parent's"(page, url) {
        const agent = numberOf(journal("agent", "create", "Parent agent"));
        await page.route(/\/api\/[^/]+\//, async (route) => {
            if (route.request().method() !== "GET" || (route.request().headers().accept || "").includes("event-stream")) return route.continue();
            const got = await route.fetch();
            const type = got.headers()["content-type"] || "";
            if (!type.includes("json")) return route.fulfill({response: got});
            const body = await got.json();
            withSubagent(body);
            await route.fulfill({response: got, json: body});
        });
        await page.goto(`${url}#/main/agent/${agent}?sub=${SUBAGENT.session}`);
        await page.getByText("Terminal", {exact: true}).first().click();
        await page.getByText("No terminal of its own").waitFor({timeout: 10000});
        await page.waitForTimeout(2500);
        await shot(page, "subagent-terminal");
        journal("agent", "delete", String(agent), "cleaning up");
    },
});
