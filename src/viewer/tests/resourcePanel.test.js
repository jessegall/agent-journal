import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import ResourcePanel from "../src/resource/ResourcePanel.vue";
import {cliOf, movesOf} from "../src/domain/resourceNouns.js";
import {pageOf} from "../src/sync/paging.js";

const later = () => new Promise((resolve) => setTimeout(resolve, 30));
globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};
const shown = () => document.body.querySelector("[data-resource-panel]");
let app = null;

function answering(rows, lines = []) {
    return async (line) => {
        lines.push(line);
        const answer = rows[line.join(" ")];
        return answer === undefined ? {ok: true, value: {rows: []}} : answer;
    };
}

async function opened(hash, read) {
    location.hash = hash;
    await later();
    const element = document.createElement("div");
    document.body.append(element);
    app = createApp({render: () => h(ResourcePanel, {read})});
    app.mount(element);
    await later();
    await nextTick();
}

afterEach(async () => {
    app?.unmount();
    app = null;
    location.hash = "";
    await later();
});

const PLAN = {
    "plan inspect 5": {ok: true, value: {id: 5, title: "Move the cart", brief: "Why the **cart** moves", state: "ready", reason: "", total: 1, finished: 0, current_phase: 0, phases: [{id: 2, title: "First phase", goal: "The goal", checkpoint: false, tasks: [{id: 7, title: "Fix the totals", state: "open"}]}]}},
    "task inspect 7": {ok: true, value: {id: 7, title: "Fix the totals", state: "open", priority: "normal", waits: [], logs: []}},
    "plan approve 5": {ok: true, value: {}},
};

test("a reference names its type by table or by model", () => {
    expect(["plans", "plan", "tasks", "docs", "processes", "dock_items"].map(cliOf)).toEqual(["plan", "plan", "task", "doc", "process", "dock-item"]);
});

test("a plan opens with its document, its phases and its tasks, and a task opens over it with a way back", async () => {
    await opened("#?open=plans:5", answering(PLAN));
    expect(shown().querySelector("[data-resource-title]").textContent).toBe("Move the cart");
    expect(shown().querySelector("[data-resource-text]").innerHTML).toContain("<strong>cart</strong>");
    expect(shown().querySelector("[data-resource-phase]").textContent).toContain("First phase");
    shown().querySelector("[data-resource-task]").click();
    await later();
    expect(shown().querySelector("[data-resource-title]").textContent).toBe("Fix the totals");
    shown().querySelector("[data-resource-back]").click();
    await later();
    expect(shown().querySelector("[data-resource-title]").textContent).toBe("Move the cart");
});

test("the inspector shows a skeleton while it opens and its content once it is fully open", async () => {
    location.hash = "#?open=plans:5";
    await later();
    const element = document.createElement("div");
    document.body.append(element);
    app = createApp({render: () => h(ResourcePanel, {read: answering(PLAN)})});
    app.mount(element);
    expect(shown().querySelector("[data-resource-opening]")).not.toBeNull();
    expect(shown().classList.contains("opening")).toBe(true);
    await vi.waitFor(() => expect(shown().querySelector("[data-resource-opening]")).toBeNull());
    expect(shown().classList.contains("opening")).toBe(false);
});

test("a plan shows how far it has come, the phase it is in and which phases are finished", async () => {
    await opened("#?open=plans:6", answering({"plan inspect 6": {ok: true, value: {id: 6, title: "Move the cart", brief: "", state: "started", reason: "", total: 3, finished: 1, current_phase: 2, phases: [
        {id: 1, title: "First", goal: "", checkpoint: false, tasks: [{id: 1, title: "One", state: "completed"}]},
        {id: 2, title: "Second", goal: "They pass", checkpoint: true, tasks: [{id: 2, title: "Two", state: "started"}, {id: 3, title: "Three", state: "open"}]},
    ]}}}));
    expect(shown().querySelector("[data-plan-status]").textContent).toBe("Started");
    expect(shown().querySelector(".phase-count").textContent).toBe("Phase 2 of 2");
    expect(shown().querySelector("[data-plan-progress]").textContent).toContain("1 of 3 done");
    const [first, second] = shown().querySelectorAll("[data-resource-phase]");
    expect(first.classList.contains("done")).toBe(true);
    expect(first.querySelector(".row").classList.contains("completed")).toBe(true);
    expect(first.querySelector('svg[aria-label="Completed"]').classList.contains("done")).toBe(true);
    expect(second.querySelector('svg[aria-label="Open"]').classList.contains("open")).toBe(true);
    expect(second.classList.contains("current")).toBe(true);
    expect(second.textContent).toContain("checkpoint");
    expect(second.textContent).toContain("0/2");
});

test("a plan's moves follow its state and run its line, and the close button shuts the panel", async () => {
    const lines = [];
    expect(movesOf("plan", {state: "ready"}).map((move) => move.word)).toEqual(["cancel"]);
    await opened("#?open=plans:5", answering(PLAN, lines));
    expect(shown().querySelector("[data-move='approve']")).toBeNull();
    shown().querySelector("[data-resource-close]").click();
    await later();
    expect(location.hash).not.toContain("open=");
});

test("a task shows its log, and a move that needs words asks for them before it runs", async () => {
    const lines = [];
    await opened("#?open=tasks:7", answering({
        "task inspect 7": {ok: true, value: {id: 7, title: "Fix the totals", state: "started", priority: "normal", brief: "The totals", waits: [], logs: [{id: 1, line: "rounding found"}]}},
        [`task-log list --task 7 --limit ${pageOf("task_logs")} --page 1`]: {ok: true, value: {rows: [{id: 1, line: "rounding found", created_at: "2026-11-03T12:00:00Z"}], is_last_page: true}},
    }, lines));
    [...shown().querySelectorAll("[data-task-tabs] button")].find((button) => button.textContent.trim() === "Log").click();
    await later();
    expect(shown().querySelector("[data-task-log]").textContent).toContain("rounding found");
    expect(shown().querySelector("[data-move='close']").textContent).toContain("Complete");
    shown().querySelector("[data-move='close']").click();
    await later();
    const input = shown().querySelector("[data-resource-ask] input");
    input.value = "fixed";
    input.dispatchEvent(new Event("input"));
    shown().querySelector("[data-resource-ask]").dispatchEvent(new Event("submit", {cancelable: true}));
    await later();
    expect(lines).toContainEqual(["task", "close", "7", "--outcome", "fixed"]);
});

test("any other row shows plain labels with no row numbers or text twice, and a refused read says why", async () => {
    await opened("#?open=memory:4", answering({"memory show 4": {ok: true, value: {id: 4, text: "Keep it", state: "active", weight: 9, creator_id: 78, environment_id: 5, created_at: "2026-11-06T10:30:28+00:00", updated_at: "2026-11-06T10:30:28+00:00"}}}));
    const fields = shown().querySelector("[data-resource-fields]").textContent;
    expect(fields).toContain("Weight");
    expect(fields).toContain("Created");
    expect(fields).not.toMatch(/creator|environment|Updated|Keep it|_at/);
    expect(shown().querySelector(".resource-type").textContent).toBe("Memory 4 · Active");
    expect(shown().querySelector("[data-resource-title]")).toBeNull();
    app.unmount();
    app = null;
    await opened("#?open=secret:1", answering({"secret show 1": {ok: false, error: "viewer.shell does not declare secret show"}}));
    expect(shown().querySelector("[data-resource-failure]").textContent).toContain("does not declare");
});

const MEMORY = {id: 4, text: "Keep it", state: "active", weight: 9, creator_id: 78, environment_id: 5, created_at: "2026-11-06T10:30:28+00:00", updated_at: "2026-11-06T10:30:28+00:00"};

test("a row names its creator by the given name of an agent, read once for the row", async () => {
    const lines = [];
    await opened("#?open=memory:4", answering({
        "memory show 4": {ok: true, value: MEMORY},
        "actor show 78": {ok: true, value: {id: 78, type: "agent", name: "session-9"}},
        "agent show 78": {ok: true, value: {id: 78, role: "worker", profile: "journal-worker", given_name: "Lady Lovelace"}},
    }, lines));
    const fields = shown().querySelector("[data-resource-fields]").textContent;
    expect(fields).toContain("Created by");
    expect(fields).toContain("Lady Lovelace");
    expect(fields).not.toContain("78");
    expect(lines.filter((line) => line[0] === "actor" || line[0] === "agent")).toEqual([["actor", "show", "78"], ["agent", "show", "78"]]);
});

test("a row names a creator who is a person by the person's name", async () => {
    const lines = [];
    await opened("#?open=memory:4", answering({
        "memory show 4": {ok: true, value: MEMORY},
        "actor show 78": {ok: true, value: {id: 78, type: "user", name: "Jesse"}},
    }, lines));
    expect(shown().querySelector("[data-resource-fields]").textContent).toContain("Jesse");
    expect(lines.some((line) => line[0] === "agent")).toBe(false);
});

test("a memory says who it belongs to by name, the main agent when no agent does, and links its task", async () => {
    await opened("#?open=memory:4", answering({"memory show 4": {ok: true, value: {...MEMORY, agent_id: null, task_id: 6700}}}));
    const fields = shown().querySelector("[data-resource-fields]").textContent;
    expect(fields).toContain("Belongs to");
    expect(fields).toContain("Main agent");
    expect(shown().querySelector("[data-resource-link]").textContent).toBe("Task 6700");
    app.unmount();
    app = null;
    await opened("#?open=memory:4", answering({
        "memory show 4": {ok: true, value: {...MEMORY, agent_id: 412}},
        "agent show 412": {ok: true, value: {id: 412, role: "worker", given_name: ""}},
    }));
    expect(shown().querySelector("[data-resource-fields]").textContent).toContain("Worker 412");
    expect(shown().querySelector("[data-resource-link]")).toBeNull();
});

test("an old agent with no given name is named by its role and number", async () => {
    await opened("#?open=memory:4", answering({
        "memory show 4": {ok: true, value: MEMORY},
        "actor show 78": {ok: true, value: {id: 78, type: "agent", name: "session-9"}},
        "agent show 78": {ok: true, value: {id: 78, role: "worker", profile: "journal-worker", given_name: ""}},
    }));
    expect(shown().querySelector("[data-resource-fields]").textContent).toContain("Worker 78");
});

test("a memory can be removed with a reason and a removed one restored", async () => {
    const lines = [];
    await opened("#?open=memory:4", answering({"memory show 4": {ok: true, value: MEMORY}}, lines));
    shown().querySelector(`[data-move="remove"]`).click();
    await later();
    const ask = shown().querySelector("[data-resource-ask]");
    ask.querySelector("input").value = "stale";
    ask.querySelector("input").dispatchEvent(new Event("input"));
    await later();
    ask.dispatchEvent(new Event("submit", {cancelable: true}));
    await later();
    expect(lines).toContainEqual(["memory", "remove", "4", "--reason", "stale"]);
    app.unmount();
    app = null;
    await opened("#?open=memory:4", answering({"memory show 4": {ok: true, value: {...MEMORY, state: "removed"}}}, lines));
    shown().querySelector(`[data-move="restore"]`).click();
    await later();
    expect(lines).toContainEqual(["memory", "restore", "4"]);
});

test("the browser's back and forward walk the rows opened", async () => {
    await opened("#?open=plans:5", answering(PLAN));
    shown().querySelector("[data-resource-task]").click();
    await later();
    expect(shown().querySelector("[data-resource-title]").textContent).toBe("Fix the totals");
    history.back();
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(shown().querySelector("[data-resource-title]").textContent).toBe("Move the cart");
});

test("a question opens with its text and a button for each option, and a pick answers it", async () => {
    const lines = [];
    await opened("#?open=questions:4", answering({"question show 4": {ok: true, value: {id: 4, title: "Which one?", text: "Which one should go first?", state: "open", options: ["Cart", "Totals"], recommended: "Cart"}}}, lines));
    expect(shown().querySelector("[data-resource-text]").textContent).toContain("Which one should go first?");
    shown().querySelector(`[data-move="answer"]`).click();
    await later();
    expect(lines).toContainEqual(["question", "answer", "4", "--answer", "Cart"]);
});
