import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import {taskWindowContext} from "./support/taskWindowContext.js";
import {planWindowContext} from "./support/planWindowContext.js";
import PlanCards from "../../core/modules/plans/web/src/PlanCards.vue";
import TaskGroups from "../../core/modules/tasks/web/src/TaskGroups.vue";

afterEach(() => (document.body.innerHTML = ""));

const task = (id, title) => ({id, title, state: "open", priority: "normal"});
const plan = (id, title) => ({id, title, state: "started", task_count: 1, completed_count: 0, phase_count: 1, current_phase: 1, created_at: "2026-11-01T10:00:00Z"});

function reader(answers, makeContext = taskWindowContext) {
    const reads = [];
    const window = makeContext({});
    window.read = async (line) => (reads.push(line), answers(line));
    return {window, reads};
}

test("finished tasks carry both close time and id when asking for the next page", async () => {
    const closed_at = "2026-11-05T10:00:00Z";
    const row = (id) => ({...task(id, `Closed ${id}`), state: "cancelled", closed_at});
    const {window, reads} = reader((line) => ({ok: true, value: {groups: [{state: "cancelled", total: 3, rows: line.includes("--before-id 2") ? [row(1)] : [row(3), row(2)]}]}}));
    const element = await mounted(TaskGroups, window);
    element.querySelector('[data-more="cancelled"]').click();
    await settle();
    expect(reads).toContain(`task board --state cancelled --before-id 2 --before-closed-at ${closed_at}`);
    expect([...element.querySelectorAll(".task-title")].map((title) => title.textContent)).toEqual(["Closed 3", "Closed 2", "Closed 1"]);
});

test("more tasks are asked for older than the oldest shown, without doubles, and a reload reads as many as were shown", async () => {
    let reloaded = false;
    const {window, reads} = reader((line) => {
        if (line.includes("--before-id")) return {ok: true, value: {groups: [{state: "open", total: 3, rows: [task(2, "Two"), task(1, "One")]}]}};
        if (line.includes("--limit")) return (reloaded = true), {ok: true, value: {groups: [{state: "open", total: 2, rows: [task(3, "Three"), task(1, "One")]}]}};
        return {ok: true, value: {groups: [{state: "open", total: 3, rows: [task(3, "Three"), task(2, "Two")]}]}};
    });
    let heard = null;
    window.follow = (patterns, handler) => ((heard = handler), () => {});
    const element = await mounted(TaskGroups, window);
    element.querySelector('[data-more="open"]').click();
    await settle();
    expect(reads).toContain("task board --state open --before-id 2");
    expect(element.textContent.match(/Two/g).length).toBe(1);
    expect(element.textContent).toContain("One");
    await heard({event: "task.update"});
    await new Promise((resolve) => setTimeout(resolve, 70));
    await settle();
    expect(reloaded).toBe(true);
    expect(element.textContent).not.toContain("Two");
});

test("the delegated tasks come with every one in progress and blocked, and more of them are asked for older than the oldest open one shown", async () => {
    const row = (id, state) => ({...task(id, `Task ${id}`), state, delegated_to: 5});
    const {window, reads} = reader((line) => {
        if (line.includes("--before-id")) return {ok: true, value: {groups: [{state: "delegated", total: 5, rows: [row(1, "open")]}]}};
        return {ok: true, value: {groups: [{state: "delegated", total: 5, rows: [row(2, "blocked"), row(9, "started"), row(8, "blocked"), row(7, "open")]}]}};
    });
    const element = await mounted(TaskGroups, window);
    expect([...element.querySelectorAll(".task-title")].map((title) => title.textContent)).toEqual(["Task 9", "Task 2", "Task 8", "Task 7"]);
    element.querySelector('[data-more="delegated"]').click();
    await settle();
    expect(reads).toContain("task board --state delegated --before-id 7");
    expect(element.querySelectorAll('[data-more="delegated"]')).toHaveLength(0);
});

test("a group folds and unfolds from its header, and stays folded on the next load", async () => {
    localStorage.removeItem("journal.tasks.folded");
    const {window} = reader(() => ({ok: true, value: {groups: [{state: "open", total: 1, rows: [task(1, "One")]}]}}));
    const element = await mounted(TaskGroups, window);
    expect(element.textContent).toContain("One");
    element.querySelector('[data-fold="open"]').click();
    await settle();
    expect(element.textContent).not.toContain("One");
    expect(element.querySelector('[data-fold="open"]').getAttribute("aria-expanded")).toBe("false");
    const again = await mounted(TaskGroups, reader(() => ({ok: true, value: {groups: [{state: "open", total: 1, rows: [task(1, "One")]}]}})).window);
    expect(again.textContent).not.toContain("One");
    again.querySelector('[data-fold="open"]').click();
    await settle();
    expect(again.textContent).toContain("One");
    localStorage.removeItem("journal.tasks.folded");
});

test("the search bar of the tasks window stays at the top as it scrolls", () => {
    const source = readFileSync(resolve(__dirname, "../../core/modules/tasks/web/src/TaskGroups.vue"), "utf8");
    expect(source).toContain('<SearchBar ref="search"');
    expect(source).toContain('class="tasks-tools"');
});

test("a plan answer for the tab left behind is dropped", async () => {
    let answerClosed = null;
    const {window} = reader((line) => {
        if (line.includes("--closed")) return new Promise((resolve) => (answerClosed = () => resolve({ok: true, value: {open_total: 1, closed_total: 1, plans: [plan(2, "Closed plan")]}})));
        return {ok: true, value: {open_total: 1, closed_total: 1, plans: [plan(1, "Open plan")]}};
    }, planWindowContext);
    const element = await mounted(PlanCards, {...window, tabs: [{key: "open", label: "Open", read: "plan board", count_field: "open_total"}, {key: "closed", label: "Closed", read: "plan board --closed", count_field: "closed_total"}]});
    element.querySelector('[data-tab="closed"]').click();
    await settle();
    element.querySelector('[data-tab="open"]').click();
    await settle();
    answerClosed();
    await settle();
    expect(element.textContent).toContain("Open plan");
    expect(element.textContent).not.toContain("Closed plan");
});

test("show more on an empty plan list asks for nothing", async () => {
    const reads = [];
    const window = planWindowContext({});
    window.read = async (line) => (reads.push(line), {ok: true, value: {open_total: 3, closed_total: 0, plans: []}});
    const element = await mounted(PlanCards, {...window, tabs: [{key: "open", label: "Open", read: "plan board", count_field: "open_total"}, {key: "closed", label: "Closed", read: "plan board --closed", count_field: "closed_total"}]});
    expect(element.querySelector("[data-plans-more]")).toBeNull();
    expect(reads.some((line) => line.includes("Infinity"))).toBe(false);
});

test("a plan card shows its state as a badge, and no phase once none is left", async () => {
    const finished = {...plan(4, "Done"), state: "approved", task_count: 3, completed_count: 3, current_phase: 0};
    const {window} = reader(() => ({ok: true, value: {open_total: 1, closed_total: 0, plans: [finished]}}), planWindowContext);
    const element = await mounted(PlanCards, {...window, tabs: [{key: "open", label: "Open", read: "plan board", count_field: "open_total"}, {key: "closed", label: "Closed", read: "plan board --closed", count_field: "closed_total"}]});
    await settle();
    expect(element.querySelector("[data-plan-state]").textContent).toBe("Approved");
    expect(element.querySelector(".plan-foot").textContent).toBe("3 of 3 tasks done");
});

test("every section has a Show tasks in plans switch that hides the tasks of a plan and shows them again, kept on the pane", async () => {
    const planned = {ok: true, value: {rows: [{id: 5, label: "Plan 5, phase 1", task_ids: [1, 3]}], page: 1, size: 50, total: 1}};
    const {window} = reader((line) => (line.startsWith("plan places") ? planned : {ok: true, value: {groups: [{state: "open", total: 2, rows: [task(1, "In a plan"), task(2, "Alone")]}, {state: "started", total: 2, rows: [task(3, "Started in a plan"), task(4, "Started alone")]}]}}));
    const element = await mounted(TaskGroups, window);
    const shown = (state) => [...element.querySelectorAll(`[data-state="${state}"] [data-row]`)].map((row) => row.dataset.row);
    const toggle = async (state) => {
        element.querySelector(`[data-plan-switch="${state}"]`).click();
        await settle();
    };
    expect(element.querySelector('[data-plan-switch="open"]').textContent).toContain("Show tasks in plans");
    expect(element.querySelector('[data-plan-switch="started"]')).not.toBeNull();
    expect([shown("open"), shown("started")]).toEqual([["1", "2"], ["3", "4"]]);
    await toggle("open");
    expect([shown("open"), shown("started")]).toEqual([["2"], ["3", "4"]]);
    expect(window.state["board.hide-plan-tasks"]).toBe("open");
    await toggle("started");
    expect([shown("open"), shown("started")]).toEqual([["2"], ["4"]]);
    expect(window.state["board.hide-plan-tasks"]).toBe("open,started");
    await toggle("open");
    await toggle("started");
    expect([shown("open"), shown("started")]).toEqual([["1", "2"], ["3", "4"]]);
    expect(window.state["board.hide-plan-tasks"]).toBeUndefined();
});
