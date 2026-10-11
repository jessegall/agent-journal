import {journal, numberOf, runScenarios, shot} from "./harness.mjs";

const SUBAGENT = {session: "sub-1", task: "Check the build", type: "general", running: false, status: "done", skills: []};

function withSubagent(node) {
    if (Array.isArray(node)) return node.forEach(withSubagent);
    if (!node || typeof node !== "object") return;
    if (node.type === "agent" && node.data && !node.data.parent) node.data.subagent_rows = [SUBAGENT];
    Object.values(node).forEach(withSubagent);
}

const SEEN_FOR = 4000;

async function routedWithSubagent(page) {
    await page.route(/\/api\/[^/]+\//, async (route) => {
        if (route.request().method() !== "GET" || (route.request().headers().accept || "").includes("event-stream")) return route.continue();
        const got = await route.fetch();
        const type = got.headers()["content-type"] || "";
        if (!type.includes("json")) return route.fulfill({response: got});
        const body = await got.json();
        withSubagent(body);
        await route.fulfill({response: got, json: body});
    });
}

await runScenarios(process.argv[2], {
    async "a message arriving leaves an open subagent inspector in place"(page, url) {
        const agent = numberOf(journal("agent", "create", "Parent agent"));
        await routedWithSubagent(page);
        await page.goto(`${url}#/main/agent/${agent}?sub=${SUBAGENT.session}`);
        const dialog = page.getByRole("dialog").first();
        await dialog.waitFor({timeout: 10000});
        await page.evaluate(() => {
            const shown = document.querySelector("[role=dialog]");
            shown.dataset.kept = "yes";
            window.removed = 0;
            new MutationObserver((records) => {
                for (const record of records) for (const node of record.removedNodes) if (node.nodeType === 1 && (node.matches("[role=dialog]") || node.querySelector("[role=dialog]"))) window.removed += 1;
            }).observe(document.body, {childList: true, subtree: true});
        });
        journal("message", "create", "A new message while the inspector is open");
        await page.waitForTimeout(SEEN_FOR);
        const after = await page.evaluate(() => ({kept: document.querySelector("[role=dialog]")?.dataset.kept || "", removed: window.removed}));
        journal("agent", "delete", String(agent), "--why", "cleaning up");
        if (after.kept !== "yes" || after.removed) throw new Error(`the inspector was rebuilt when a message arrived: ${JSON.stringify(after)}`);
    },
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
        await shot(page, "subagent-terminal");
        journal("agent", "delete", String(agent), "--why", "cleaning up");
    },
});
