import {createApp, h, ref} from "vue";
import {afterEach, expect, test} from "vitest";
import PlanDetails from "../src/resource/PlanDetails.vue";
import PlanPhases from "../src/resource/PlanPhases.vue";
import PlanPhasesWindow from "../../core/modules/plans/web/src/PlanPhasesWindow.vue";
import {context, mounted, settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const PLAN = {
    id: 3, title: "Move the cart", brief: "Why the cart moves", state: "started", reason: "", total: 3, finished: 1, current_phase: 2, delegated: false,
    phases: [
        {id: 1, title: "First", goal: "", checkpoint: false, tasks: [{id: 7, title: "Fix the totals", state: "completed", priority: 200, complexity: null, tags: [], reason: "", automatic: false, delegated_to: null, main_delegate: false}]},
        {id: 2, title: "Second", goal: "", checkpoint: false, tasks: [
            {id: 8, title: "Move the cart", state: "started", priority: 300, complexity: 3, tags: ["cart"], reason: "", automatic: false, delegated_to: 12, main_delegate: false, helper_id: 12, helper_name: "Lovelace"},
            {id: 9, title: "Check it", state: "blocked", priority: 200, complexity: null, tags: [], reason: "waits on task 8", automatic: false, delegated_to: null, main_delegate: false},
        ]},
    ],
};

function drawn(component, props, slots = {}) {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(component, props, slots)}).directive("tip", {}).mount(element);
    return element;
}

test("the details say the state, the phase it is in, how far it has come and the brief", async () => {
    const element = drawn(PlanDetails, {plan: PLAN});
    await settle();
    expect(element.querySelector("[data-plan-status]").textContent).toContain("Started");
    expect(element.textContent).toContain("Phase 2 of 2");
    expect(element.querySelector("[data-plan-progress]").textContent).toContain("1 of 3 done");
    expect(element.querySelector("[data-resource-text]").textContent).toContain("Why the cart moves");
});

test("a blocked plan says what it waits on, and a cancelled one why", async () => {
    expect(drawn(PlanDetails, {plan: {...PLAN, state: "blocked", reason: "the review"}}).querySelector("[data-plan-reason]").textContent).toContain("Blocked, waiting on");
    expect(drawn(PlanDetails, {plan: {...PLAN, state: "cancelled", reason: "no longer needed"}}).querySelector("[data-plan-reason]").textContent).toContain("Why it was cancelled");
});

test("a delegated plan names its worker, or says it is delegated", async () => {
    const element = drawn(PlanDetails, {plan: {...PLAN, delegated: true, agents: [{name: "Lovelace"}]}});
    await settle();
    expect(element.querySelector("[data-plan-delegated]")).not.toBeNull();
});

test("the phases leave the drawing of each task to the slot", async () => {
    const element = drawn(PlanPhases, {phases: PLAN.phases, currentPhase: 2}, {task: ({task}) => h("i", {"data-slotted": task.id})});
    await settle();
    expect([...element.querySelectorAll("[data-slotted]")].map((one) => one.dataset.slotted)).toEqual(["7", "8", "9"]);
});

test("the plan inspector draws each task as the Tasks window row, with its tags, agent, complexity, priority and reason", async () => {
    const window = {...context({}), option: (key) => ref(key === "row" ? PLAN : undefined)};
    const element = await mounted(PlanPhasesWindow, window);
    expect([...element.querySelectorAll(".task[data-row]")].map((one) => one.dataset.row)).toEqual(["7", "8", "9"]);
    const started = element.querySelector('.task[data-row="8"]');
    expect(started.querySelector("[data-task-tag]").textContent).toBe("cart");
    expect(started.querySelector("[data-task-agent] [role='tooltip'] b").textContent).toBe("Worker 12");
    expect(started.querySelector("[data-task-complexity]")).not.toBeNull();
    expect(started.querySelector("[data-task-priority]")).not.toBeNull();
    expect(element.querySelector('.task[data-row="9"] [data-task-reason]').textContent).toBe("waits on task 8");
    expect(element.querySelector('.task[data-row="9"] [data-task-warning]')).not.toBeNull();
});

test("an agent with only blocked tasks in a phase is Queued, and one with a started or testing task is Working", async () => {
    const task = (id, state, helper) => ({id, title: `Task ${id}`, state, helper_id: helper, helper_name: `Agent ${helper}`});
    const phases = [{id: 1, title: "Build", goal: "", checkpoint: false, tasks: [task(1, "blocked", 12), task(2, "blocked", 13), task(3, "testing", 13), task(4, "started", 14), task(5, "open", 15)]}];
    const element = drawn(PlanPhases, {phases, currentPhase: 1}, {task: () => null});
    await settle();
    const words = Object.fromEntries([...element.querySelectorAll("[data-plan-phase-agent]")].map((agent) => [agent.querySelector("[data-agent-badge-name]").textContent.split(" ")[1], agent.querySelector(".agent-word").textContent]));
    expect(words).toEqual({12: "Queued", 13: "Working", 14: "Working", 15: "Queued"});
});
