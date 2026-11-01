import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import ResourcePanel from "../src/resource/ResourcePanel.vue";
import {cliOf, movesOf} from "../src/domain/resourceKinds.js";

const later = () => new Promise((resolve) => setTimeout(resolve, 30));
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
    "plan show 5": {ok: true, value: {id: 5, title: "Move the cart", brief: "Why the **cart** moves", state: "ready"}},
    "plan outline 5": {ok: true, value: {plan_id: 5, phases: [{id: 2, title: "First phase", goal: "The goal", tasks: [{id: 7, title: "Fix the totals", state: "open"}]}]}},
    "task show 7": {ok: true, value: {id: 7, title: "Fix the totals", state: "open"}},
    "plan approve 5": {ok: true, value: {}},
};

test("a reference names its kind by table or by model", () => {
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

test("a plan's moves follow its state and run its line, and the close button shuts the panel", async () => {
    const lines = [];
    expect(movesOf("plan", {state: "ready"}).map((move) => move.word)).toEqual(["approve", "cancel"]);
    await opened("#?open=plans:5", answering(PLAN, lines));
    shown().querySelector("[data-move='approve']").click();
    await later();
    expect(lines).toContainEqual(["plan", "approve", "5"]);
    shown().querySelector("[data-resource-close]").click();
    await later();
    expect(location.hash).not.toContain("open=");
});

test("a task shows its log, and a move that needs words asks for them before it runs", async () => {
    const lines = [];
    await opened("#?open=tasks:7", answering({
        "task show 7": {ok: true, value: {id: 7, title: "Fix the totals", state: "started", brief: "The totals"}},
        "task-log list --task 7 --oldest --limit 100": {ok: true, value: {rows: [{id: 1, line: "rounding found"}]}},
    }, lines));
    expect(shown().querySelector("[data-resource-logs]").textContent).toContain("rounding found");
    shown().querySelector("[data-move='close']").click();
    await later();
    const input = shown().querySelector("[data-resource-ask] input");
    input.value = "fixed";
    input.dispatchEvent(new Event("input"));
    shown().querySelector("[data-resource-ask]").dispatchEvent(new Event("submit", {cancelable: true}));
    await later();
    expect(lines).toContainEqual(["task", "close", "7", "--outcome", "fixed"]);
});

test("any other row shows its fields, labels above, and a refused read says why", async () => {
    await opened("#?open=question:4", answering({"question show 4": {ok: true, value: {id: 4, title: "Which one?", state: "open", agent_id: 3}}}));
    expect(shown().querySelector("[data-resource-fields]").textContent).toContain("agent_id");
    app.unmount();
    app = null;
    await opened("#?open=secret:1", answering({"secret show 1": {ok: false, error: "viewer.shell does not declare secret show"}}));
    expect(shown().querySelector("[data-resource-failure]").textContent).toContain("does not declare");
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
