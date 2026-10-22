import {createApp} from "vue";
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import {flush} from "./flush.js";

globalThis.ResizeObserver ??= class {
    observe() {}

    unobserve() {}

    disconnect() {}
};
window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

const {api} = await import("../src/api/client.js");
const {store} = await import("../src/state/store.js");
const {taskBoard} = await import("../src/state/taskBoard.js");
const {boardLines, nextAct, shownTasks, statusChoices, waitLine} = await import("../src/domain/taskBoard.js");
const {taskGraph} = await import("../src/domain/taskGraph.js");
const {default: TasksDialog} = await import("../src/tasks/TasksDialog.vue");

const task = (id, title, more = {}) => ({
    table: "tasks",
    id,
    title,
    brief: "",
    state: "open",
    plan_id: null,
    waits: [],
    block_reason: "",
    finished_at: null,
    ...more,
});
const blocked = (id, title, waits, more = {}) => task(id, title, {state: "blocked", waits, ...more});
const plan = {
    table: "plans",
    id: 31,
    title: "Tasks open in a dialog",
    state: "started",
    task_ids: [1, 2, 3],
    phases: [
        {title: "The list", task_ids: [1, 2]},
        {title: "The inspector", task_ids: [3]},
    ],
};
const board = () => [
    task(1, "first", {plan_id: 31}),
    blocked(2, "second", ["tasks:1"], {plan_id: 31}),
    task(3, "third", {plan_id: 31, state: "done", finished_at: "2026-10-21T10:00:00+00:00"}),
    task(4, "fourth"),
];
const press = (key, target = window) => target.dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true}));
const inDialog = (selector) => document.body.querySelector(`.tasks-dialog ${selector}`);
let app = null;

async function opened() {
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp(TasksDialog);
    app.directive("tip", {});
    app.mount(host);
    await flush();
}

beforeEach(() => {
    store.booted = false;
    store.rows = {tasks: board(), plans: [plan], questions: [], comments: [], checks: []};
    Object.assign(taskBoard, {
        view: "list",
        selected: 0,
        inspecting: false,
        statuses: [],
        words: "",
        folded: {},
        unfolded: {},
        draft: null,
    });
    Object.assign(taskBoard.display, {grouping: "plan", showDone: false, number: true, wait: true});
    vi.spyOn(api, "act").mockResolvedValue({});
    vi.spyOn(api, "create").mockResolvedValue({id: 9});
    vi.spyOn(api, "taskLogs").mockResolvedValue([]);
});

afterEach(async () => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

describe("the tasks dialog", () => {
    test("lists the tasks under their plan and phase, says what a blocked one waits on and hides the done ones", async () => {
        await opened();
        const heads = [...document.body.querySelectorAll(".tasks-dialog .head")].map((h) => h.querySelector(".label").textContent.trim());
        expect(heads).toEqual(["Tasks open in a dialog", "Phase 1 of 2: The list", "Not in a plan"]);
        const titles = [...document.body.querySelectorAll(".tasks-dialog .task-row .title")].map((t) => t.textContent);
        expect(titles).toEqual(["first", "second", "fourth"]);
        expect(inDialog('.task-row[data-task="2"] .wait').textContent).toBe("Blocked by task 1");
        expect(inDialog(".hidden-done").textContent).toContain("1 done task is hidden.");
    });

    test("C opens the new-task card and Enter files the task with its title", async () => {
        await opened();
        press("c");
        await flush();
        const title = inDialog(".task-draft .title");
        title.value = "Write the upgrade notes";
        title.dispatchEvent(new Event("input"));
        press("Enter", title);
        await flush();
        expect(api.create).toHaveBeenCalledWith("tasks", {title: "Write the upgrade notes", brief: ""});
        expect(taskBoard.selected).toBe(9);
        expect(taskBoard.draft).toBeNull();
    });

    test("a blocked task opens with the step that clears its wait, and that step goes to the task it waits on", async () => {
        await opened();
        inDialog('.task-row[data-task="2"]').click();
        await flush();
        const step = inDialog(".task-inspector .acts button");
        expect(step.textContent.trim()).toBe("Go to task 1");
        step.click();
        await flush();
        expect(taskBoard.selected).toBe(1);
        expect(inDialog(".task-row.selected").dataset.task).toBe("1");
    });

    test("a started task names the agent that holds it in hand, and an open one names none", async () => {
        store.rows.tasks = [task(1, "first", {plan_id: 31, state: "started", held_by: "worker 2, Lady Lovelace"}), task(4, "fourth")];
        await opened();
        inDialog('.task-row[data-task="1"]').click();
        await flush();
        const held = [...document.body.querySelectorAll(".task-inspector .fact")].find((f) => f.querySelector(".label").textContent === "Held by");
        expect(held.querySelector(".value").textContent).toBe("worker 2, Lady Lovelace");
        app.unmount();
        store.rows.tasks = [task(4, "fourth")];
        await opened();
        inDialog('.task-row[data-task="4"]').click();
        await flush();
        expect([...document.body.querySelectorAll(".task-inspector .fact .label")].map((l) => l.textContent)).not.toContain("Held by");
    });

    test("the inspector's comment form sits below its scrolling content, and a task's comments carry no document's selection hint", async () => {
        await opened();
        inDialog('.task-row[data-task="1"]').click();
        await flush();
        expect(inDialog(".task-inspector > .write .comment-write")).not.toBeNull();
        expect(inDialog(".task-inspector .body .comment-write")).toBeNull();
        expect(inDialog(".task-inspector .comments .none").textContent).toContain("No comments yet.");
        expect(inDialog(".task-inspector .none-hint")).toBeNull();
    });

    test("blocking a task offers no task that already waits on it and posts the one picked", async () => {
        await opened();
        inDialog('.task-row[data-task="1"]').click();
        await flush();
        [...document.body.querySelectorAll(".task-inspector .acts button")].find((b) => b.textContent.trim() === "Block").click();
        await flush();
        const offered = [...document.body.querySelectorAll(".task-block-form .pick button")];
        expect(offered.map((b) => b.querySelector(".title").textContent)).toEqual(["fourth"]);
        offered[0].click();
        await flush();
        [...document.body.querySelectorAll(".dialog-foot button")].find((b) => b.textContent.trim() === "Block task 1").click();
        await flush();
        expect(api.act).toHaveBeenCalledWith("tasks", 1, "block", {on: ["task:4"], why: ""});
    });
});

describe("the tasks dialog's rules", () => {
    test("each wait has its own line and its own next step", () => {
        store.rows = {tasks: [], questions: [], checks: []};
        const onTask = blocked(1, "a", ["tasks:2"]);
        const onQuestion = blocked(2, "b", ["questions:7"]);
        const onCommand = blocked(3, "c", ["checks:5"]);
        const onReason = blocked(4, "d", [], {block_reason: "the release is not out"});
        expect([onTask, onQuestion, onCommand, onReason].map(waitLine)).toEqual([
            "Blocked by task 2",
            "Waiting on question 7",
            "Waiting for a command to pass",
            "Blocked: the release is not out",
        ]);
        expect([onTask, onQuestion, onCommand, onReason].map((t) => nextAct(t).label)).toEqual([
            "Go to task 2",
            "Answer question 7",
            "Unblock",
            "Unblock",
        ]);
        expect(nextAct(task(5, "e", {state: "parked"})).label).toBe("Resume");
    });

    test("a started task can be paused, blocked or finished, and says why it cannot go back to open", () => {
        const choices = statusChoices(task(1, "a", {state: "started"}));
        expect(choices.filter((c) => c.act).map((c) => c.status)).toEqual(["parked", "blocked", "done"]);
        expect(choices.find((c) => c.status === "open").note).toBe("Only a blocked or done task goes back to open");
        expect(choices.find((c) => c.current).status).toBe("started");
    });

    test("grouped by status, a folded group keeps its head and drops its rows", () => {
        store.rows = {tasks: board(), plans: [plan], questions: []};
        const shown = shownTasks(board(), {statuses: [], display: {showDone: true}, words: ""});
        const lines = boardLines("status", {shown, all: board(), plans: [plan], folded: {sopen: true}});
        expect(lines.map((l) => (l.type === "head" ? l.label : l.task.id))).toEqual(["Blocked", 2, "Open", "Done", 3]);
    });

    test("the graph points a waiting task at what it waits on and folds a long chain to its two ends", () => {
        store.rows = {tasks: [], questions: [], checks: []};
        const chain = [10, 11, 12, 13].map((id) => blocked(id, `link ${id}`, [`tasks:${id + 1}`]));
        const tasks = [...chain, task(14, "end"), blocked(20, "asks", ["questions:7"]), task(30, "alone")];
        const graph = taskGraph(tasks);
        const kinds = graph.placed.map((p) => p.node.kind);
        expect(kinds.filter((k) => k === "fold")).toHaveLength(1);
        expect(graph.placed.find((p) => p.node.kind === "fold").node.count).toBe(3);
        expect(graph.edges.map((e) => `${e.from}>${e.to}`)).toContain("t20>q7");
        expect(graph.others).toBe(1);
        const open = taskGraph(tasks, {unfolded: {t10: true}});
        expect(open.placed.filter((p) => p.node.kind === "task")).toHaveLength(6);
    });
});
