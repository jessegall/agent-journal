import {expect, test} from "vitest";
import {context, drawn, mounted, page, settle} from "./support/windowContext.js";
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

test("the chat window shows the environment's messages", async () => {
    expect(await drawn(Chat, context({"message feed": page([{id: 1, type: "user", text: "Ship the cart today"}])}))).toContain("Ship the cart today");
});

test("the chat names each day above its first row", async () => {
    const element = await mounted(Chat, context({"message feed": page([{id: 2, type: "user", text: "today", created_at: new Date().toISOString()}, {id: 1, type: "user", text: "long ago", created_at: "2020-03-02T10:00:00Z"}])}));
    const lines = [...element.querySelectorAll("[data-day-line]")].map((line) => line.textContent);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("March 2020");
    expect(lines[1]).toContain("Today");
});

test("the chat's rows are a real list, with or without an arrival motion", async () => {
    const element = await mounted(Chat, context({"message feed": page([{id: 1, type: "user", text: "Ship the cart", created_at: "2020-03-02T10:00:00Z"}])}));
    expect(element.querySelector(".row-list").tagName).toBe("UL");
});

test("a reply shows a band with what it answers on top of its bubble, or says it was earlier", async () => {
    const element = await mounted(Chat, context({"message feed": page([
        {id: 3, type: "agent", text: "On it", parent_id: 1, created_at: "2026-11-01T10:02:00Z"},
        {id: 2, type: "agent", text: "Which one?", parent_id: 99, created_at: "2026-11-01T10:01:00Z"},
        {id: 1, type: "user", text: "Fix the cart", created_at: "2026-11-01T10:00:00Z"},
    ])}));
    const [earlier, known] = element.querySelectorAll(".message-card .message-quote");
    expect(earlier.textContent).toContain("An earlier message");
    expect(known.textContent).toContain("Fix the cart");
    expect(known.closest(".message-card").textContent).toContain("On it");
});

test("the chat's pinned links shrink to a corner and come back", async () => {
    const element = await mounted(Chat, context({"message feed": page([]), "notice list": page([{id: 1, title: "Ready to review", link: "https://example.test", label: "Open", created_at: "2020-03-02T10:00:00Z"}])}));
    expect(element.textContent).toContain("Ready to review");
    element.querySelector(".pins-toggle").click();
    await settle();
    expect(element.textContent).not.toContain("Ready to review");
    element.querySelector(".pins-toggle").click();
    await settle();
    expect(element.textContent).toContain("Ready to review");
});

test("the tasks window shows each task's title and state", async () => {
    const text = await drawn(TaskList, context({"task board": {ok: true, value: {groups: [{state: "started", total: 1, rows: [{id: 7, title: "Fix the cart", state: "started"}]}]}}}));
    expect(text).toContain("Fix the cart");
    expect(text).toContain("Started");
});

test("the plans window shows each plan's title and state", async () => {
    const text = await drawn(PlanList, context({"plan board": {ok: true, value: {open_total: 1, closed_total: 0, plans: [{id: 3, title: "Checkout", state: "started", task_count: 0, completed_count: 0, current_phase: 0}]}}}));
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
    const windowContext = context({"hook-call feed": page([{id: 9, hook: "pre_tool_use", tool: "Edit", summary: "src/cart.py", answer: "refused", refusal: "start a task first"}])}, 2);
    const text = await drawn(HookCallList, windowContext);
    expect(text).toContain("start a task first");
    expect(windowContext.reads[0]).toContain("--agent-id 2");
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
    expect(await drawn(TaskList, context({}))).toContain("no answer for task board");
});

test("the terminal window draws its agent's terminal lines and reads the newer ones after the last", async () => {
    const windowContext = context({"agent terminal": page([{number: 1, text: "ready"}, {number: 2, text: "The total is in cents now"}])}, 2);
    const text = await drawn(Terminal, windowContext);
    expect(text).toContain("ready");
    expect(text).toContain("The total is in cents now");
    expect(windowContext.reads[0]).toBe("agent terminal 2 --after 0");
});

test("the terminal window of an agent with no terminal lines says so", async () => {
    expect(await drawn(Terminal, context({"agent terminal": page([])}, 2))).toContain("No terminal output from this agent yet");
});

test("the transcript window shows one agent's conversation, each turn under its author", async () => {
    const windowContext = context({"agent transcript 7": page([{id: 1, author: "user", row_type: "user", text: "Fix the cart total"},
                                                              {id: 2, author: "assistant", row_type: "assistant", text: "The total is in cents now"}])}, 7);
    const text = await drawn(Transcript, windowContext);
    expect(text).toContain("Fix the cart total");
    expect(text).toContain("The total is in cents now");
    expect(windowContext.reads).toContain("agent transcript 7");
});

test("a line typed in the terminal goes to the agent, and a refusal gives it back with the reason", async () => {
    const window = {...context({"agent terminal": page([])}, 7), lines: []};
    window.run = async (line) => (window.lines.push(line), {ok: false, error: "no launcher is running here"});
    const element = await mounted(Terminal, window);
    const form = element.querySelector("[data-terminal-run]");
    const input = form.querySelector("input");
    input.value = "ls -la";
    input.dispatchEvent(new Event("input"));
    form.dispatchEvent(new Event("submit"));
    await settle();
    expect(window.lines).toEqual([["agent", "type", "7", "ls -la"]]);
    expect(element.querySelector("[data-terminal-refusal]").textContent).toBe("no launcher is running here");
    expect(form.querySelector("input").value).toBe("ls -la");
});

