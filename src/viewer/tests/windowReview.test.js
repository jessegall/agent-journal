import {expect, test} from "vitest";
import PlanCards from "../../core/modules/plans/web/src/PlanCards.vue";
import TaskGroups from "../../core/modules/tasks/web/src/TaskGroups.vue";
import DumpRows from "../../core/modules/dumps/web/src/DumpRows.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";

// task 5489: the windows as version 4 drew them

test("a plan is a card with its task count, its phase and its state, open plans apart from closed ones", async () => {
    const window = context({
        "plan list": page([{id: 1, title: "Checkout", state: "started"}, {id: 2, title: "Old", state: "completed"}]),
        "plan progress 1": {ok: true, value: {task_count: 4, completed_count: 1, current_phase: 2}},
        "plan progress 2": {ok: true, value: {task_count: 2, completed_count: 2, current_phase: 1}},
    });
    const element = await mounted(PlanCards, window);
    expect(element.querySelector(`[data-tab="open"]`).textContent).toContain("1");
    expect(element.querySelector(`[data-row="1"]`).textContent).toContain("1 of 4 tasks done · phase 2");
    expect(element.querySelector(`[data-row="2"]`)).toBeNull();
    element.querySelector(`[data-tab="closed"]`).click();
    await settle();
    expect(element.querySelector(`[data-row="2"]`).textContent).toContain("Old");
});

test("tasks sit in a group for each state and a search narrows them", async () => {
    const window = context({"task list": page([{id: 1, title: "Fix the cart", state: "started", priority: "normal"}, {id: 2, title: "Price it", state: "blocked", priority: "high"}])});
    const element = await mounted(TaskGroups, window);
    expect([...element.querySelectorAll("[data-state]")].map((group) => group.dataset.state)).toEqual(["started", "blocked"]);
    const box = element.querySelector(".tasks-search");
    box.value = "price";
    box.dispatchEvent(new Event("input"));
    await settle();
    expect([...element.querySelectorAll(".task-title")].map((title) => title.textContent)).toEqual(["Price it"]);
});

test("a dump is a card with each item, where the agent has got to with it and what it filed it into", async () => {
    const window = context({
        "dump list": page([{id: 5, title: "Notes", brief: "From the call", outcome: ""}]),
        "dump-item list": page([
            {id: 1, dump_id: 5, position: 2, text: "Second", state: "failed", note: "no home for it", summary: "", refs: []},
            {id: 2, dump_id: 5, position: 1, text: "First", state: "filed", note: "", summary: "Cart rules", refs: ["doc 3"]},
        ]),
    });
    const element = await mounted(DumpRows, window);
    const items = [...element.querySelectorAll("[data-item]")];
    expect(items.map((item) => item.dataset.state)).toEqual(["filed", "failed"]);
    expect(items[0].textContent).toContain("Filed into doc 3");
    expect(items[1].textContent).toContain("no home for it");
});

// task 5498: a plan card says where its plan stands, by the dock type it is docked as
test("a docked plan's card names where the plan stands from its dock type", async () => {
    const {default: PlanDock} = await import("../../core/modules/plans/web/src/PlanDock.vue");
    const stands = {"plans.waiting": "Waiting for you", "plans.started": "Started", "plans.paused": "Paused", "plans.done": "Done", "plans.cancelled": "Cancelled"};
    for (const [type, words] of Object.entries(stands)) {
        const window = context({});
        window.option = () => ({value: {id: 1, type, title: "Checkout"}});
        const element = await mounted(PlanDock, window);
        expect(element.textContent.trim()).toBe(words);
    }
});
