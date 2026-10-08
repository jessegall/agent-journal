import {journal, numberOf, reply, runScenarios, shot} from "./harness.mjs";

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
        const first = await page.locator(".statusbar-roll").innerText();
        await page.waitForFunction((was) => document.querySelector(".statusbar-roll").innerText !== was, first);
        await page.locator(".legend", {hasText: "Waiting"}).waitFor();
        await page.locator(".wait-edge.waiting").waitFor();
        await page.locator(".wait-mark").waitFor();
        if (await page.locator(".thread-turn.busy").count()) throw new Error("waiting shows again in the bar above the message box");
        const words = await page.locator(".legend").innerText();
        if (!words.startsWith("Waiting") || words.includes("test suite")) throw new Error("the label on the box says more than Waiting");
        await page.locator(".edge .spot").first().waitFor({state: "attached"});
        await page.locator(".flash-veil").waitFor({state: "detached"});
        await shot(page, "waiting-box");
        await page.locator(".legend").click();
        await page.getByText("What the agent is waiting on").waitFor();
        const label = await page.locator(".waiting-label").first().boundingBox();
        const status = await page.locator(".waiting-report").first().boundingBox();
        if (Math.abs(label.y - status.y) > 3) throw new Error("the item's status is not level with its first line");
        await shot(page, "waiting-list");
        journal("work", "end", String(n), "--how", "done");
    },
    async "the agent's reply to a comment shows as the same card on its side"(page, url) {
        const todo = numberOf(journal("todo", "create", `Reply card ${Date.now()}`, "--brief", "for the reply card"));
        const asked = numberOf(journal("todo", "comment", String(todo), "> the passage\n\nwhy this?"));
        journal("comment", "reply", String(asked), "because of that");
        await idleAgent(page);
        await page.goto(`${url}#/main`);
        const reply = page.locator(".thread-turn:not(.mine)", {hasText: "because of that"});
        await reply.getByText(`Comment on to-do ${todo}`, {exact: false}).waitFor();
        await reply.getByText("the passage").waitFor();
        await page.locator(".flash-veil").waitFor({state: "detached"});
        await shot(page, "comment-reply");
    },
    async "an idle agent with nothing to wait on says it is ready, not waiting"(page, url) {
        await idleAgent(page);
        await page.goto(`${url}#/main`);
        await page.locator(".statusbar-text b", {hasText: "Idle"}).waitFor();
        await page.getByText("ready for your next message").waitFor();
        if (await page.locator(".legend").count()) throw new Error("an idle agent shows a waiting label on the message box");
    },
});
