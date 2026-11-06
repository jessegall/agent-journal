import {afterEach, expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import TasksWindow from "../../core/modules/tasks/web/src/TasksWindow.vue";

const BOARD = {ok: true, value: {groups: [
    {state: "started", total: 1, rows: [{id: 7, title: "Fix the cart", state: "started", priority: "high"}]},
    {state: "open", total: 1, rows: [{id: 8, title: "Fix the totals", state: "open", priority: "normal"}]},
    {state: "completed", total: 3, rows: []},
]}};
const inspection = (id) => ({ok: true, value: {id, title: id === 7 ? "Fix the cart" : "Fix the totals", brief: "What done looks like", state: id === 7 ? "started" : "open", priority: "normal", reason: "", outcome: "", holder_id: 2, created_at: "2026-11-01T10:00:00Z", updated_at: "2026-11-01T10:00:00Z", waits: [{id: 9, title: "Order the parts", state: "open"}], logs: [{id: 1, line: "Found the rounding"}]}});
const PLACE = {ok: true, value: {plan_id: 3, plan_title: "Checkout", phase_number: 2, phase_total: 4, phase_title: "Payment"}};

globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};
Element.prototype.scrollIntoView ??= () => {};
afterEach(() => (document.body.innerHTML = ""));

async function dialog() {
    const ran = [];
    const window = context({"task board": BOARD});
    const subscriptions = [];
    window.follow = (events, callback) => {
        subscriptions.push({events, callback});
        return () => {};
    };
    window.run = async (line) => {
        ran.push(line);
        if (line[0] === "task-log") return {ok: true, value: {rows: [{id: 1, line: "Found the rounding", created_at: "2026-11-03T12:00:00Z"}], is_last_page: true}};
        if (line[1] === "inspect") return inspection(Number(line[2]));
        if (line[1] === "place") return PLACE;
        if (line[1] === "make") return {ok: true, value: {id: 8}};
        return {ok: true, value: {}};
    };
    const element = await mounted(TasksWindow, window);
    document.body.append(element);
    element.querySelector("[data-manage-tasks]").click();
    await settle();
    return {ran, subscriptions, shown: document.querySelector("[data-tasks-dialog]")};
}

const press = async (key) => {
    document.body.dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true}));
    await settle();
};

test("the tasks window opens the dialog, with what is not done counted and each group listed", async () => {
    const {shown} = await dialog();
    expect(shown.querySelector("[data-tasks-standing]").textContent).toBe("2 not done");
    expect(shown.textContent).toContain("Fix the cart");
    expect(shown.textContent).toContain("Fix the totals");
});

test("clicking a task opens the inspector with its place, brief, waits, log and moves", async () => {
    const {shown} = await dialog();
    shown.querySelector("[data-row='7']").click();
    await settle();
    const inspector = shown.querySelector("[data-task-inspector]");
    const actions = inspector.querySelector("[data-inspector-actions]");
    expect(actions.previousElementSibling.classList.contains("top")).toBe(true);
    expect(actions.querySelector("[data-move]")).not.toBeNull();
    expect(inspector.querySelector("[data-task-crumb]").textContent).toBe("Plan 3 › Phase 2: Payment");
    expect(inspector.querySelector("[data-resource-title]").textContent).toBe("Fix the cart");
    expect(inspector.querySelector("[data-task-brief]").textContent).toContain("What done looks like");
    expect(inspector.querySelector("[data-resource-waits]").textContent).toContain("Order the parts");
    [...inspector.querySelectorAll("[data-task-tabs] button")].find((button) => button.textContent.trim() === "Log").click();
    await settle();
    expect(inspector.querySelector("[data-task-log]").textContent).toContain("Found the rounding");
    expect(inspector.querySelector("[data-move='close']")).not.toBeNull();
});

test("a new task log entry refreshes the open Log tab", async () => {
    const {shown, ran, subscriptions} = await dialog();
    shown.querySelector("[data-row='7']").click();
    await settle();
    [...shown.querySelectorAll("[data-task-tabs] button")].find((button) => button.textContent.trim() === "Log").click();
    await settle();
    const reads = ran.filter((line) => line[0] === "task-log").length;
    const subscription = subscriptions.find(({events}) => events.includes("task_log.*"));
    expect(subscription).toBeDefined();
    subscription.callback();
    await settle();
    expect(ran.filter((line) => line[0] === "task-log")).toHaveLength(reads + 1);
});

test("the keys walk the list, open the inspector and step it", async () => {
    const {shown} = await dialog();
    await press("j");
    expect(shown.querySelector(".task.selected").dataset.row).toBe("7");
    await press("Enter");
    expect(shown.querySelector("[data-task-inspector] [data-resource-title]").textContent).toBe("Fix the cart");
    await press("j");
    expect(shown.querySelector("[data-task-inspector] [data-resource-title]").textContent).toBe("Fix the totals");
    await press("Escape");
    expect(shown.querySelector("[data-task-inspector]")).toBeNull();
});

test("the status button lists the moves and runs the one picked", async () => {
    const {shown, ran} = await dialog();
    shown.querySelector("[data-row='8']").click();
    await settle();
    shown.querySelector("[data-task-state]").click();
    await settle();
    const block = [...document.querySelectorAll(".menu-panel button, .menu-panel [role=menuitem]")].find((item) => item.textContent.trim() === "Block");
    expect(block).toBeTruthy();
    expect(ran.some((line) => line[1] === "block")).toBe(false);
});

test("a new task is filed with its brief, and opens in the inspector", async () => {
    const {shown, ran} = await dialog();
    shown.querySelector("[data-new-task]").click();
    await settle();
    const draft = shown.querySelector("[data-task-draft]");
    const title = draft.querySelector("input");
    title.value = "Fix the totals";
    title.dispatchEvent(new Event("input"));
    const brief = draft.querySelector("textarea");
    brief.value = "They add up";
    brief.dispatchEvent(new Event("input"));
    await settle();
    draft.querySelector("[data-file-task]").click();
    await settle();
    expect(ran).toContainEqual(["task", "make", "Fix the totals", "--brief", "They add up"]);
    expect(shown.querySelector("[data-task-draft]")).toBeNull();
    expect(shown.querySelector("[data-task-inspector] [data-resource-title]").textContent).toBe("Fix the totals");
});

test("a priority is changed from the inspector", async () => {
    const {shown, ran} = await dialog();
    shown.querySelector("[data-row='7']").click();
    await settle();
    [...shown.querySelectorAll("[data-task-priority] button")].find((button) => button.textContent.trim() === "High").click();
    await settle();
    expect(ran).toContainEqual(["task", "edit", "7", "--priority", "300"]);
});

async function menuItem(selector, trigger) {
    document.querySelector(trigger).click();
    await settle();
    return document.querySelector(selector);
}

test("the filter menu narrows the list by status, shows a chip and clears", async () => {
    const {shown} = await dialog();
    (await menuItem('[data-filter-state="blocked"]', "[data-menu-filter]")).click();
    await settle();
    expect(document.querySelector("[data-task-filters]").textContent).toContain("Status: Blocked");
    expect(shown.querySelector('section[data-state="open"]')).toBeNull();
    document.querySelector("[data-clear-filters]").click();
    await settle();
    expect(document.querySelector("[data-task-filters]")).toBeNull();
});

test("the display menu hides the numbers, flattens the groups and shows completed tasks", async () => {
    const {shown} = await dialog();
    expect(shown.querySelector('section[data-state="completed"]')).toBeNull();
    (await menuItem("[data-show-done]", "[data-menu-display]")).click();
    await settle();
    expect(shown.querySelector('section[data-state="completed"]')).not.toBeNull();
    document.querySelector('[data-shown="number"]').click();
    await settle();
    expect(shown.querySelector(".task-id")).toBeNull();
    document.querySelector('[data-grouping="none"]').click();
    await settle();
    expect(shown.querySelector(".tasks-group-head")).toBeNull();
});

test("the keys menu lists the keys", async () => {
    await dialog();
    document.querySelector("[data-menu-keys]").click();
    await settle();
    expect(document.body.textContent).toContain("List or graph");
});

test("deleting from the more menu asks a second time", async () => {
    const {ran, shown} = await dialog();
    shown.querySelector('[data-row="7"]').click();
    await settle();
    (await menuItem("[data-delete-task]", "[data-menu-more]")).click();
    await settle();
    expect(ran).not.toContainEqual(["task", "delete", "7"]);
    document.querySelector("[data-delete-task]").click();
    await settle();
    expect(ran).toContainEqual(["task", "delete", "7"]);
});

test("the standing counts every task not done, whatever the filter shows", async () => {
    const {shown} = await dialog();
    const before = shown.querySelector("[data-tasks-standing]").textContent;
    (await menuItem('[data-filter-state="blocked"]', "[data-menu-filter]")).click();
    await settle();
    expect(shown.querySelector("[data-tasks-standing]").textContent).toBe(before);
});

test("grouping by nothing keeps show more and the finished groups", async () => {
    const {shown} = await dialog();
    (await menuItem("[data-show-done]", "[data-menu-display]")).click();
    await settle();
    document.querySelector('[data-grouping="none"]').click();
    await settle();
    expect(shown.querySelector(".tasks-group-head")).toBeNull();
    expect(shown.querySelector('[data-more="completed"]')).not.toBeNull();
});

test("the plan places are read from the board and each outline", async () => {
    const {readPlanPlaces} = await import("../../core/modules/tasks/web/src/planPlaces.js");
    const read = async (line) => (line === "plan board"
        ? {ok: true, value: {plans: [{id: 3, title: "Checkout"}]}}
        : {ok: true, value: {phases: [{id: 7, title: "Payment", tasks: [{id: 40}]}]}});
    expect(await readPlanPlaces({read})).toEqual([{phaseId: 7, label: "Plan 3: Checkout › Payment", taskIds: [40]}]);
});

test("a block from the inspector can name what opens the task", async () => {
    const lines = [];
    const {default: RowMoves} = await import("../src/resource/RowMoves.vue");
    const {createApp, h, nextTick} = await import("vue");
    const element = document.createElement("div");
    createApp({render: () => h(RowMoves, {noun: "task", id: 7, row: {state: "started"}, read: async (line) => (lines.push(line), {ok: true, value: {}})})}).mount(element);
    element.querySelector('[data-move="block"]').click();
    await nextTick();
    const [reason, opener] = element.querySelectorAll("input");
    reason.value = "needs the key";
    reason.dispatchEvent(new Event("input"));
    opener.value = "question:4";
    opener.dispatchEvent(new Event("input"));
    await nextTick();
    element.querySelector("form").dispatchEvent(new Event("submit"));
    await nextTick();
    expect(lines).toEqual([["task", "block", "7", "--reason", "needs the key", "--on", "question:4"]]);
});
