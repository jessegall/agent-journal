import {journal, numberOf, reply, runScenarios, shot} from "./harness.mjs";

const AGENT = {n: 1, ref: "agent:1", type: "agent", title: "Main agent", completed: 0, deleted: 0, seen: [], refs: [], data: {status: "idle", at: Date.now() / 1000}};

async function idleAgent(page, data = {}) {
    await page.route(/\/api\/main\/agent\?/, (route) => reply(route, {rows: [{...AGENT, data: {...AGENT.data, ...data}}]}));
}

async function waitsOn(page, url, what, run = null) {
    const n = numberOf(journal("work", "start", `Waiting ${Date.now()}`));
    journal("work", "await", String(n), what, ...(run ? ["--on", run.id] : []));
    await idleAgent(page, run ? {shell_rows: [{id: run.id, command: what, running: true}]} : {});
    await page.goto(`${url}#/main`);
    return n;
}

async function whileWaiting(page, url, what, run, body) {
    const n = await waitsOn(page, url, what, run);
    try {
        await body();
    } finally {
        journal("work", "end", String(n), "--how", "done");
    }
}

await runScenarios(process.argv[2], {
    async "an agent waiting on a run says Waiting, what it waits on, and lists it"(page, url) {
        await whileWaiting(page, url, "the test suite", null, async () => {
            await page.locator(".statusbar-text b", {hasText: "Waiting"}).waitFor();
            if ((await page.locator(".statusbar-roll").innerText()).includes("the test suite")) throw new Error("the status bar repeats what the waiting badge says");
            await page.locator(".legend", {hasText: "Waiting"}).waitFor();
            await page.locator(".wait-edge.waiting").waitFor();
            await page.locator(".wait-mark").waitFor();
            if (await page.locator(".thread-turn.busy").count()) throw new Error("waiting shows again in the bar above the message box");
            const words = await page.locator(".legend").innerText();
            if (!words.startsWith("Waiting") || words.includes("test suite")) throw new Error("the label on the box says more than Waiting");
            await page.locator(".legend .working-dots i").nth(2).waitFor();
            if (await page.locator(".wait-edge .glow").count()) throw new Error("the box still glows while it waits");
            await page.locator(".flash-veil").waitFor({state: "detached"});
            await shot(page, "waiting-box");
            await page.locator(".legend").click();
            await page.getByText("What the agent is waiting on").waitFor();
            const label = await page.locator(".waiting-label").first().boundingBox();
            const status = await page.locator(".waiting-report").first().boundingBox();
            if (Math.abs(label.y - status.y) > 3) throw new Error("the item's status is not level with its first line");
            await shot(page, "waiting-list");
        });
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
    async "a multi-line command waited on shows as its first word and a project path on one line"(page, url) {
        const command = "python3 /nowhere/Project builds/src/x.py --all\nfor f in a b; do\n  echo $f\ndone";
        await whileWaiting(page, url, command, {id: "shell-2"}, async () => {
            await page.locator(".legend", {hasText: "Waiting"}).click();
            const label = await page.locator(".waiting-label").first().innerText();
            if (label !== "python3 src/x.py") throw new Error(`the run shows as "${label}", not its first word and project path`);
            const bar = await page.locator(".statusbar-roll").innerText();
            if (bar.includes("\n") || bar.includes("for f in")) throw new Error("the status bar shows the raw command");
            await shot(page, "waiting-multiline");
        });
    },
    async "an agent's inspector keeps the chat's padding and shows that agent's own waiting state"(page, url) {
        await whileWaiting(page, url, "the test suite", {id: "shell-1"}, async () => {
            await page.goto(`${url}#/main?open=agent:1`);
            const thread = page.locator(".agent-inspector .thread");
            await thread.waitFor();
            const padding = await thread.evaluate((node) => getComputedStyle(node).paddingLeft);
            if (padding !== "24px") throw new Error(`the inspector's chat has ${padding} of padding, not the main chat's 24px`);
            await page.locator(".agent-inspector .legend", {hasText: "Waiting"}).waitFor();
            await shot(page, "inspector-chat");
            const box = await page.locator(".agent-inspector .legend").boundingBox();
            if (process.env.SHOT_DIR) await page.screenshot({path: `${process.env.SHOT_DIR}/waiting-badge-close.png`, clip: {x: box.x - 20, y: box.y - 16, width: box.width + 120, height: box.height + 40}});
        });
    },
    async "an idle agent with nothing to wait on says it is ready, not waiting"(page, url) {
        await idleAgent(page);
        await page.goto(`${url}#/main`);
        await page.locator(".statusbar-text b", {hasText: "Idle"}).waitFor();
        await page.getByText("ready for your next message").waitFor();
        if (await page.locator(".legend").count()) throw new Error("an idle agent shows a waiting label on the message box");
    },
});
