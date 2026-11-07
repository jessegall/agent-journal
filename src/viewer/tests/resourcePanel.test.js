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

test("the browser's back and forward walk the rows opened", async () => {
    await opened("#?open=plans:5", answering(PLAN));
    shown().querySelector("[data-resource-task]").click();
    await later();
    expect(shown().querySelector("[data-resource-title]").textContent).toBe("Fix the totals");
    history.back();
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(shown().querySelector("[data-resource-title]").textContent).toBe("Move the cart");
});

const leaving = () => new Promise((resolve) => setTimeout(resolve, 450));

test("focus moves into the panel when a row opens and back to what opened it when it closes", async () => {
    const opener = document.createElement("button");
    document.body.append(opener);
    opener.focus();
    await opened("#?open=plans:5", answering(PLAN));
    expect(document.activeElement).toBe(shown());
    location.hash = "#";
    await later();
    expect(document.activeElement).toBe(opener);
    opener.remove();
});

test("Escape closes an open action form first, then the top row, then the panel", async () => {
    await opened("#?open=plans:5,plans:6", answering({...PLAN, "plan inspect 6": {ok: true, value: {...PLAN["plan inspect 5"].value, id: 6}}}));
    const form = document.createElement("div");
    form.setAttribute("role", "dialog");
    form.setAttribute("aria-modal", "true");
    document.body.append(form);
    window.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape"}));
    await later();
    expect(location.hash).toContain("plans:6");
    form.remove();
    window.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape"}));
    await later();
    expect(location.hash).toContain("plans:5");
    expect(location.hash).not.toContain("plans:6");
    window.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape"}));
    await later();
    await leaving();
    expect(shown()).toBeNull();
});

test("a declared noun closes on Escape and on a click on the veil, and Back unpeeks", async () => {
    const {DECLARED_NOUNS} = await import("../src/resource/declaredNouns.js");
    DECLARED_NOUNS.add("plan");
    try {
        const catalogue = {inspector: () => ({noun: "plan", module: "journal.core.plans", fingerprint: "a", reads: "plan inspect {row_id}", label: "", title: "{title}", description: "", width: "medium", components: [], comments: false, events: [], links: null, shareable: false}), window: () => null, sectionsAt: () => []};
        location.hash = "#?open=memories:3,plans:5";
        await later();
        const element = document.createElement("div");
        document.body.append(element);
        app = createApp({render: () => h(ResourcePanel, {read: answering(PLAN), catalogue, environment: "main"})});
        app.mount(element);
        await later();
        expect(shown().getAttribute("style")).toContain("min(640px, 100vw)");
        shown().querySelector("[data-resource-back]").click();
        await later();
        expect(location.hash).not.toContain("plans:5");
        window.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape"}));
        await leaving();
        expect(shown()).toBeNull();
        location.hash = "#?open=plans:5";
        await later();
        document.body.querySelector(".veil").click();
        await leaving();
        expect(shown()).toBeNull();
    } finally {
        DECLARED_NOUNS.delete("plan");
    }
});
