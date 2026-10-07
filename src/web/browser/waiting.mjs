import {journal, numberOf, reply, runScenarios} from "./harness.mjs";

const AGENT = {n: 1, ref: "agent:1", type: "agent", title: "Main agent", completed: 0, deleted: 0, seen: [], refs: [], data: {status: "idle", at: Date.now() / 1000}};

async function idleAgent(page) {
    await page.route(/\/api\/main\/agent\?/, (route) => reply(route, {rows: [AGENT]}));
}

async function waitsOn(page, url, what) {
    const n = numberOf(journal("work", "start", `Waiting ${Date.now()}`));
    journal("work", "await", String(n), what);
    await idleAgent(page);
    await page.goto(`${url}#/main`);
    return n;
}

await runScenarios(process.argv[2], {
    async "an agent waiting on a run says Waiting, what it waits on, and lists it"(page, url) {
        const n = await waitsOn(page, url, "the test suite");
        await page.locator(".statusbar-text b", {hasText: "Waiting"}).waitFor();
        await page.locator(".statusbar-roll", {hasText: "on the test suite"}).waitFor();
        await page.locator(".legend", {hasText: "Waiting on the test suite"}).waitFor();
        await page.locator(".wait-edge.waiting").waitFor();
        await page.locator(".legend").click();
        await page.getByText("What the agent is waiting on").waitFor();
        journal("work", "end", String(n), "--how", "done");
    },
    async "an idle agent with nothing to wait on says it is ready, not waiting"(page, url) {
        await idleAgent(page);
        await page.goto(`${url}#/main`);
        await page.locator(".statusbar-text b", {hasText: "Idle"}).waitFor();
        await page.getByText("ready for your next message").waitFor();
        if (await page.locator(".legend").count()) throw new Error("an idle agent shows a waiting label on the message box");
    },
});
