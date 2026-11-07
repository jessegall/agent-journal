import {planWindowContext} from "./support/planWindowContext.js";
import {ref} from "vue";
import {expect, test} from "vitest";
import PlanCards from "../../core/modules/plans/web/src/PlanCards.vue";
import TaskGroups from "../../core/modules/tasks/web/src/TaskGroups.vue";
import DumpRows from "../../core/modules/dumps/web/src/DumpRows.vue";
import {mounted, settle} from "./support/windowContext.js";
import {dumpWindowContext} from "./support/dumpWindowContext.js";
import {taskWindowContext} from "./support/taskWindowContext.js";

// task 5489: the windows as version 4 drew them

test("a plan is a card with its task count, its phase and its state, open plans apart from closed ones", async () => {
    const window = planWindowContext({
        "plan board --closed": {ok: true, value: {open_total: 1, closed_total: 1, plans: [{id: 2, title: "Old", state: "completed", task_count: 2, completed_count: 2, current_phase: 1}]}},
        "plan board": {ok: true, value: {open_total: 1, closed_total: 1, plans: [{id: 1, title: "Checkout", state: "started", task_count: 4, completed_count: 1, current_phase: 2}]}},
    });
    const element = await mounted(PlanCards, {...window, tabs: [{key: "open", label: "Open", read: "plan board", count_field: "open_total"}, {key: "closed", label: "Closed", read: "plan board --closed", count_field: "closed_total"}]});
    expect(element.querySelector(`[data-tab="open"]`).textContent).toContain("1");
    expect(element.querySelector(`[data-row="1"]`).textContent).toContain("1 of 4 tasks done · phase 2");
    expect(element.querySelector(`[data-row="2"]`)).toBeNull();
    element.querySelector(`[data-tab="closed"]`).click();
    await settle();
    expect(element.querySelector(`[data-row="2"]`).textContent).toContain("Old");
});

test("tasks sit in a group for each state and a search narrows them", async () => {
    const window = taskWindowContext({"task board": {ok: true, value: {groups: [
        {state: "started", total: 1, rows: [{id: 1, title: "Fix the cart", state: "started", priority: "normal"}]},
        {state: "blocked", total: 1, rows: [{id: 2, title: "Price it", state: "blocked", priority: "high"}]},
        {state: "completed", total: 0, rows: []},
    ]}}});
    const element = await mounted(TaskGroups, window);
    expect([...element.querySelectorAll("[data-state]")].map((group) => group.dataset.state)).toEqual(["started", "blocked"]);
    const box = element.querySelector("[data-search-input]");
    box.value = "price";
    box.dispatchEvent(new Event("input"));
    await settle();
    expect([...element.querySelectorAll(".task-title")].map((title) => title.textContent)).toEqual(["Price it"]);
});

test("a dump is a card with each item, where the agent has got to with it and what it filed it into", async () => {
    const window = dumpWindowContext({
        "dump board": {ok: true, value: {total: 1, dumps: [{id: 5, title: "Notes", brief: "From the call", outcome: "", items: [
            {id: 2, text: "First", state: "filed", note: "", summary: "Cart rules", refs: ["doc 3"]},
            {id: 1, text: "Second", state: "failed", note: "no home for it", summary: "", refs: []},
        ]}]}},
    });
    const element = await mounted(DumpRows, window);
    const items = [...element.querySelectorAll("[data-item]")];
    expect(items.map((item) => item.dataset.state)).toEqual(["filed", "failed"]);
    expect(items[0].textContent).toContain("Filed into doc 3");
    expect(items[1].textContent).toContain("no home for it");
});

test("each group of tasks pages on its own, and a finished group shows only its count until asked", async () => {
    const window = taskWindowContext({
        "task board --state open --before-id 1": {ok: true, value: {groups: [{state: "open", total: 2, rows: [{id: 2, title: "Second", state: "open", priority: "normal"}]}]}},
        "task board --state completed": {ok: true, value: {groups: [{state: "completed", total: 1, rows: [{id: 3, title: "Done", state: "completed", priority: "normal"}]}]}},
        "task board": {ok: true, value: {groups: [{state: "open", total: 2, rows: [{id: 1, title: "First", state: "open", priority: "normal"}]}, {state: "completed", total: 1, rows: []}]}},
    });
    const element = await mounted(TaskGroups, window);
    const titles = () => [...element.querySelectorAll(".task-title")].map((title) => title.textContent);
    expect(titles()).toEqual(["First"]);
    element.querySelector(`[data-more="open"]`).click();
    await settle();
    expect(titles()).toEqual(["First", "Second"]);
    element.querySelector(`[data-more="completed"]`).click();
    await settle();
    expect(titles()).toEqual(["First", "Second", "Done"]);
});
