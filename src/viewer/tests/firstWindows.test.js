import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import TaskList from "../../core/modules/tasks/web/src/tasks.js";
import PlanList from "../../core/modules/plans/web/src/plans.js";
import AgentList from "../../core/modules/agents/web/src/agents.js";
import SubagentList from "../../core/modules/agents/web/src/subagents.js";
import Transcript from "../../core/modules/agents/web/src/transcript.js";
import HookCallList from "../../core/modules/drivers/web/src/HookCallList.vue";
import FileFeed from "../../suites/coding/web/src/FileFeed.vue";
import FileEdits from "../../suites/coding/web/src/FileEdits.vue";
import Terminal from "../../suites/coding/web/src/Terminal.vue";

const page = (rows) => ({ok: true, value: {rows, page: 1, size: 50, total: rows.length}});

function context(answers, agent = null) {
    const reads = [];
    return {
        reads,
        window: "test.window",
        environment: "main",
        agent,
        visible: {value: true},
        permissions: {reads: [], runs: [], missing: [], ask: async () => true},
        read: async (line) => {
            reads.push(line);
            const key = Object.keys(answers).find((start) => line.startsWith(start));
            return key ? answers[key] : {ok: false, failure: "refused", error: `no answer for ${line}`};
        },
        run: async () => ({ok: true, value: null}),
        follow: () => {},
        open: () => {},
        setting: async (key, fallback) => fallback,
        keep: async () => {},
    };
}

async function drawn(component, windowContext) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(component)});
    app.provide(WINDOW_CONTEXT, windowContext);
    app.mount(element);
    for (let round = 0; round < 5; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
    return element.textContent;
}

test("the chat window shows the environment's messages", async () => {
    expect(await drawn(Chat, context({"message list": page([{id: 1, type: "user", text: "Ship the cart today"}])}))).toContain("Ship the cart today");
});

test("the tasks window shows each task's title and state", async () => {
    const text = await drawn(TaskList, context({"task list": page([{id: 7, title: "Fix the cart", state: "started"}])}));
    expect(text).toContain("Fix the cart");
    expect(text).toContain("started");
});

test("the plans window shows each plan's title and state", async () => {
    const text = await drawn(PlanList, context({"plan list": page([{id: 3, title: "Checkout", state: "started"}])}));
    expect(text).toContain("Checkout");
    expect(text).toContain("started");
});

test("the agents window shows each agent's role and session", async () => {
    const text = await drawn(AgentList, context({"agent list": page([{id: 2, role: "main", session: "s-1", program: "claude"}])}));
    expect(text).toContain("main");
    expect(text).toContain("s-1");
});

test("the subagents window reads only the subagents of its own agent", async () => {
    const windowContext = context({"agent list": page([{id: 5, role: "subagent", session: "s-1/a", program: "claude"}])}, 2);
    expect(await drawn(SubagentList, windowContext)).toContain("s-1/a");
    expect(windowContext.reads[0]).toContain("--parent 2");
});

test("the hook calls window shows its agent's hook calls with their answers", async () => {
    const windowContext = context({"hook-call list": page([{id: 9, hook: "pre_tool_use", tool: "Edit", summary: "src/cart.py", answer: "refused", refusal: "start a task first"}])}, 2);
    const text = await drawn(HookCallList, windowContext);
    expect(text).toContain("start a task first");
    expect(windowContext.reads[0]).toContain("--agent 2");
});

test("the file feed shows its agent's edits with their counts", async () => {
    const windowContext = context({"file-edit list": page([{id: 1, path: "src/cart.py", added: 3, removed: 1}])}, 2);
    const text = await drawn(FileFeed, windowContext);
    expect(text).toContain("src/cart.py");
    expect(text).toContain("+3");
    expect(windowContext.reads[0]).toContain("--agent 2");
});

test("the file edits window shows every agent's edits", async () => {
    expect(await drawn(FileEdits, context({"file-edit list": page([{id: 1, path: "src/cart.py", added: 3, removed: 1, agent_id: 2}])}))).toContain("src/cart.py");
});

test("a window shows the reason a read was refused", async () => {
    expect(await drawn(TaskList, context({}))).toContain("no answer for task list");
});

test("the terminal window says it is not available yet", async () => {
    expect(await drawn(Terminal, context({}, 2))).toContain("The terminal is not available in version 5 yet");
});

test("the transcript window shows one agent's conversation, each turn under its author", async () => {
    const windowContext = context({"agent transcript 7": page([{id: 1, author: "user", row_type: "user", text: "Fix the cart total"},
                                                              {id: 2, author: "assistant", row_type: "assistant", text: "The total is in cents now"}])}, 7);
    const text = await drawn(Transcript, windowContext);
    expect(text).toContain("Fix the cart total");
    expect(text).toContain("The total is in cents now");
    expect(windowContext.reads).toContain("agent transcript 7");
});
