import {expect, test, vi} from "vitest";
import {ref} from "vue";
import {context, drawn, mounted, page, settle} from "./support/windowContext.js";
import {fileEditsWindowContext} from "./support/fileEditsWindowContext.js";
import {fileFeedWindowContext} from "./support/fileFeedWindowContext.js";
import {context as agentContext} from "./support/agentWindowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import TaskList from "../../core/modules/tasks/web/src/tasks.js";
import PlanList from "../../core/modules/plans/web/src/plans.js";
import AgentList from "../../core/modules/agents/web/src/agents.js";
import SubagentList from "../../core/modules/agents/web/src/helpers.js";
import Transcript from "../../core/modules/agents/web/src/transcript.js";
import HookCallList from "../../core/modules/drivers/web/src/HookCallList.vue";
import FileFeed from "../../suites/coding/web/src/FileFeed.vue";
import FileEdits from "../../suites/coding/web/src/FileEdits.vue";
import ProjectFiles from "../../suites/coding/web/src/ProjectFiles.vue";
import Terminal from "../../suites/coding/web/src/Terminal.vue";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

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
    const element = await mounted(Chat, context({"message feed": page([]), "pin list": page([{id: 1, title: "Ready to review", link: "https://example.test", label: "Open", created_at: "2020-03-02T10:00:00Z"}])}));
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
    const window = {...context({"plan board": {ok: true, value: {open_total: 1, closed_total: 0, plans: [{id: 3, title: "Checkout", state: "started", task_count: 0, completed_count: 0, current_phase: 0}]}}}), tabs: [{key: "open", read: "plan board"}]};
    const text = await drawn(PlanList, window);
    expect(text).toContain("Checkout");
    expect(text).toContain("Started");
});

test("the agents window shows each helper's role", async () => {
    const rows = page([{id: 6, role: "worker", session: "s-3", program: "claude"}, {id: 7, role: "helper", session: "s-4", program: "claude"}]);
    const text = await drawn(AgentList, agentContext({"agent cards": rows}));
    expect(text).toContain("Worker6");
    expect(text).toContain("Helper");
});

test("the helpers window lists every agent but the main one", async () => {
    const rows = page([{id: 2, role: "main", session: "s-1", program: "claude"}, {id: 5, role: "helper", session: "s-1/a", program: "claude"}, {id: 6, role: "worker", session: "w-1", program: "claude"}]);
    const windowContext = agentContext({"agent cards": page(rows.value.rows.filter((row) => row.role !== "main"))});
    const text = await drawn(SubagentList, windowContext);
    expect(text).toContain("Helper5");
    expect(text).toContain("Worker6");
    expect(text).not.toContain("Main agent");
});

test("the hook calls window shows its agent's hook calls with their answers", async () => {
    const windowContext = context({"hook-call feed": page([{id: 9, hook: "pre_tool_use", tool: "Edit", summary: "src/cart.py", answer: "refused", refusal: "start a task first"}])}, 2);
    const text = await drawn(HookCallList, windowContext);
    expect(text).toContain("start a task first");
    expect(windowContext.reads[0]).toContain("--session-agent-id 2");
});

test("the file feed shows its agent's edits with their counts", async () => {
    const windowContext = fileFeedWindowContext({"file-edit list": page([{id: 1, path: "src/cart.py", added: 3, removed: 1}])}, 2);
    const text = await drawn(FileFeed, windowContext);
    expect(text).toContain("cart.py");
    expect(text).toContain("+3");
    expect(windowContext.reads[0]).toContain("--agent 2");
});

test("the file edits window shows every agent's edits", async () => {
    expect(await drawn(FileEdits, fileEditsWindowContext({"file-edit list": page([{id: 1, path: "src/cart.py", added: 3, removed: 1, session_agent_id: 2}])}))).toContain("src/cart.py");
});

test("a window shows the reason a read was refused", async () => {
    expect(await drawn(TaskList, context({}))).toContain("no answer for task board");
});

test("the terminal window lists its agent's commands in order, marks journal lines and refusals, and opens a long line", async () => {
    const windowContext = context({"hook-call feed": page([
        {id: 3, agent_id: 2, hook: "pre_tool_use", tool: "Bash", summary: "rm -rf build", refusal: "not this"},
        {id: 2, agent_id: 2, hook: "pre_tool_use", tool: "Bash", summary: "journal task list", refusal: ""},
        {id: 1, agent_id: 2, hook: "pre_tool_use", tool: "Bash", summary: "pytest -q", refusal: ""},
        {id: 9, agent_id: 2, hook: "post_tool_use", tool: "Bash", summary: "pytest -q", refusal: ""},
        {id: 10, agent_id: 2, hook: "pre_tool_use", tool: "Monitor", summary: "", refusal: ""},
        {id: 8, agent_id: 2, hook: "pre_tool_use", tool: "Read", summary: "a.py", refusal: ""},
    ])}, 2);
    const element = await mounted(Terminal, {...windowContext, option: () => ref("journal")});
    expect(windowContext.reads[0]).toBe("hook-call feed --session-agent-id 2 --limit 200");
    const rows = [...element.querySelectorAll("[data-terminal-command]")];
    expect(rows.map((row) => row.querySelector(".terminal-text").textContent)).toEqual(["pytest -q", "journal task list", "rm -rf build"]);
    expect(rows.map((row) => row.querySelector(".terminal-mark").textContent)).toEqual(["$", "#", "$"]);
    expect(rows[2].querySelector("[data-terminal-refused]")).not.toBeNull();
    rows[0].querySelector(".terminal-text").click();
    await settle();
    expect(rows[0].querySelector(".terminal-text").classList.contains("open")).toBe(true);
});

test("the terminal's detail level shows commands alone, the journal's lines too, or every tool", async () => {
    const answers = {"hook-call feed": page([
        {id: 1, agent_id: 2, hook: "pre_tool_use", tool: "Bash", summary: "pytest -q", refusal: ""},
        {id: 2, agent_id: 2, hook: "pre_tool_use", tool: "Bash", summary: "journal task list", refusal: ""},
        {id: 3, agent_id: 2, hook: "pre_tool_use", tool: "Read", summary: "a.py", refusal: ""},
    ])};
    const shown = async (verbosity) => {
        const windowContext = {...context(answers, 2), option: () => ref(verbosity)};
        const element = await mounted(Terminal, windowContext);
        return [...element.querySelectorAll("[data-terminal-command] .terminal-text")].map((row) => row.textContent);
    };
    expect(await shown("commands")).toEqual(["pytest -q"]);
    expect(await shown("journal")).toEqual(["pytest -q", "journal task list"]);
    expect(await shown("everything")).toEqual(["pytest -q", "journal task list", "a.py"]);
});

test("the terminal window of an agent with no commands says so", async () => {
    expect(await drawn(Terminal, context({"hook-call feed": page([])}, 2))).toContain("No commands from this agent yet");
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
    const window = {...context({"hook-call feed": page([])}, 7), lines: []};
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

test("the files window opens the file its address names", async () => {
    window.history.pushState({}, "", "?page=coding.files&file=src/cart.py");
    const shown = {...context({'project-file list ""': page([])}), read: async (line) => (line.startsWith("project-file show") ? {ok: true, value: {path: "src/cart.py", text: "TOTAL = 0"}} : page([]))};
    const lines = [];
    const reading = shown.read;
    shown.read = async (line) => (lines.push(line), reading(line));
    const element = await mounted(ProjectFiles, shown);
    window.history.pushState({}, "", "?");
    await settle();
    expect(lines).toContain('project-file show "src/cart.py"');
    expect(element.textContent).toContain("TOTAL = 0");
});

test("the files window marks the line its address names and scrolls it into view", async () => {
    window.history.pushState({}, "", "?page=coding.files&file=src/cart.py&line=2");
    const scrolled = [];
    window.HTMLElement.prototype.scrollIntoView = function () { scrolled.push(this.dataset.fileLine); };
    const shown = {...context({'project-file list ""': page([])}), read: async (line) => (line.startsWith("project-file show") ? {ok: true, value: {path: "src/cart.py", text: "TOTAL = 0\nTAX = 1\nFEE = 2"}} : page([]))};
    const element = await mounted(ProjectFiles, shown);
    window.history.pushState({}, "", "?");
    await settle();
    expect([...element.querySelectorAll(".files-line.target")].map((line) => line.dataset.fileLine)).toEqual(["2"]);
    expect(scrolled).toEqual(["2"]);
    delete window.HTMLElement.prototype.scrollIntoView;
});

