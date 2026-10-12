import {runScenarios, shot} from "./harness.mjs";

const FIGURE = ".voice-figure";
const HOME = "[data-figure-home]";

// the environment's agent as the agent list reports it, at work with a search in flight
async function working(page) {
    await page.route(/\/api\/main\/agent\?/, async (route) => {
        const response = await route.fetch();
        const body = await response.json();
        const now = Date.now() / 1000;
        const row = {n: 9001, title: "claude-9001", type: "agent", completed: 0, deleted: 0, created: now - 60, updated: now, refs: [], seen: [], sections: [], brief: "",
            outcome: "", abstract: "", data: {status: "working", event: "PreToolUse", tool: "Grep", at: now, provider: "claude", model: "opus"}};
        await route.fulfill({response, json: {...body, rows: [row, ...(body.rows || [])]}});
    });
}

// where the figure's feet are, and the top of the compose box it stands on
const footing = (page) =>
    page.evaluate(([figure, home]) => {
        const box = document.querySelector(figure).getBoundingClientRect();
        return {feet: box.bottom, edge: document.querySelector(home).getBoundingClientRect().top, shown: getComputedStyle(document.querySelector(figure)).display};
    }, [FIGURE, HOME]);

await runScenarios(process.argv[2], {
    async "the voice's figure stands on the compose box on every load, and a reload takes its file from the cache, not the network"(page, url) {
        await working(page);
        const fetched = [];
        page.on("request", (request) => request.url().endsWith(".glb") && fetched.push(request.url()));
        await page.goto(`${url}#/main`);
        await page.locator(FIGURE).waitFor({state: "visible"});
        await page.reload();
        await page.locator(FIGURE).waitFor({state: "visible"});
        await page.waitForFunction(([figure, home]) => {
            const feet = document.querySelector(figure).getBoundingClientRect().bottom;
            return Math.abs(feet - document.querySelector(home).getBoundingClientRect().top) < 12;
        }, [FIGURE, HOME]);
        const {feet, edge, shown} = await footing(page);
        if (shown !== "block") throw new Error(`the figure is ${shown} after a reload`);
        if (Math.abs(feet - edge) > 12) throw new Error(`the figure's feet are at ${feet}, the compose box's edge at ${edge}`);
        if (fetched.length !== 1) throw new Error(`the figure's file was fetched ${fetched.length} times over two loads: ${fetched.join(", ")}`);
        await shot(page, "figure-on-the-compose-box");
    },
});
