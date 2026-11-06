import {createApp, h} from "vue";
import {expect, test} from "vitest";
import TaskFacts from "../src/tasks/TaskFacts.vue";

function mounted(state, emitted) {
    const element = document.createElement("div");
    createApp({render: () => h(TaskFacts, {task: {id: 7, state, priority: 200}, onPriority: (priority) => emitted.push(priority)})}).mount(element);
    return element;
}

test.each(["open", "started", "completed", "cancelled"])("a %s task has its priority to change, as in version 4", (state) => {
    const emitted = [];
    const element = mounted(state, emitted);
    [...element.querySelectorAll("[data-task-priority] button")].find((button) => button.textContent.trim() === "High").click();
    expect(emitted).toEqual(["300"]);
});

test("a priority between two levels lights the level at or below it, and the number stays", () => {
    const element = document.createElement("div");
    createApp({render: () => h(TaskFacts, {task: {id: 7, state: "open", priority: 301}})}).mount(element);
    const on = [...element.querySelectorAll("[data-task-priority] button.on")].map((button) => button.textContent.trim());
    expect(on).toEqual(["High"]);
});

function mountedFor(task) {
    const element = document.createElement("div");
    createApp({render: () => h(TaskFacts, {task: {id: 7, priority: 200, ...task}})}).mount(element);
    return element;
}

test("a task an agent holds names it and says what merging and releasing do", () => {
    const element = mountedFor({state: "started", holder_id: 12, helper_id: 12, helper_name: "Lady Lovelace"});
    expect(element.querySelector("[data-task-agent]").textContent).toBe("Lady Lovelace");
    expect(element.querySelector("[data-task-held-by]").textContent).toBe("Lady Lovelace holds it: merging its work finishes it, and releasing the worker opens it again.");
    expect(element.textContent).not.toContain("Agent 12");
});

test("a task queued for an agent names it as queued and not as held", () => {
    const element = mountedFor({state: "open", delegated_to: 12, helper_id: 12, helper_name: "Lady Lovelace"});
    expect([...element.querySelectorAll(".fact-label")].map((label) => label.textContent)).toContain("Queued for");
    expect(element.querySelector("[data-task-held-by]").textContent).toContain("takes it after the task it is on");
});

test("a task nobody holds shows no agent and no note", () => {
    const element = mountedFor({state: "open"});
    expect(element.querySelector("[data-task-agent]")).toBeNull();
    expect(element.querySelector("[data-task-held-by]")).toBeNull();
});

test("the plan of a task is a link that opens it, and a task in no plan says so", () => {
    const inPlan = document.createElement("div");
    createApp({render: () => h(TaskFacts, {task: {id: 7, state: "open", priority: 200}, place: {plan_id: 1097, plan_title: "One read"}})}).mount(inPlan);
    const link = inPlan.querySelector("[data-task-plan-link]");
    expect(link.textContent).toBe("Plan 1097: One read");
    link.click();
    expect(window.location.hash + window.location.search + window.location.pathname).toContain("1097");
    const noPlan = mountedFor({state: "open"});
    expect(noPlan.querySelector("[data-task-plan-link]")).toBeNull();
    expect(noPlan.textContent).toContain("Not in a plan");
});
