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

const CATALOGUE = {
    inspector: (noun) => ({noun, module: "acme", fingerprint: "a", reads: `${noun} inspect {row_id}`, label: "", title: "{title}", description: "", width: "medium", components: [], comments: false, events: [], links: null, shareable: false}),
    window: () => null,
    sectionsAt: () => [],
};

async function opened(hash, read) {
    location.hash = hash;
    await later();
    const element = document.createElement("div");
    document.body.append(element);
    app = createApp({render: () => h(ResourcePanel, {read, catalogue: CATALOGUE, environment: "main"})});
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

test("the inspector shows a skeleton while it opens and its content once it is fully open", async () => {
    location.hash = "#?open=plans:5";
    await later();
    const element = document.createElement("div");
    document.body.append(element);
    app = createApp({render: () => h(ResourcePanel, {read: answering(PLAN), catalogue: CATALOGUE, environment: "main"})});
    app.mount(element);
    expect(shown().querySelector("[data-resource-opening]")).not.toBeNull();
    expect(shown().classList.contains("opening")).toBe(true);
    await vi.waitFor(() => expect(shown().querySelector("[data-resource-opening]")).toBeNull());
    expect(shown().classList.contains("opening")).toBe(false);
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
