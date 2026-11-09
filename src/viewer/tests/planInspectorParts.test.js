import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import PlanDetails from "../src/resource/PlanDetails.vue";
import PlanPhases from "../src/resource/PlanPhases.vue";
import {settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const PLAN = {
    id: 3, title: "Move the cart", brief: "Why the cart moves", state: "started", reason: "", total: 3, finished: 1, current_phase: 2, delegated: false,
    phases: [
        {id: 1, title: "First", goal: "", checkpoint: false, tasks: [{id: 7, title: "Fix the totals", state: "completed"}]},
        {id: 2, title: "Second", goal: "", checkpoint: false, tasks: [{id: 8, title: "Move the cart", state: "started"}, {id: 9, title: "Check it", state: "open"}]},
    ],
};

function drawn(component, props) {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(component, props)}).directive("tip", {}).mount(element);
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

test("a blocked plan says what it waits on, and a cancelled one justification", async () => {
    expect(drawn(PlanDetails, {plan: {...PLAN, state: "blocked", reason: "the review"}}).querySelector("[data-plan-reason]").textContent).toContain("Blocked, waiting on");
    expect(drawn(PlanDetails, {plan: {...PLAN, state: "cancelled", reason: "no longer needed"}}).querySelector("[data-plan-reason]").textContent).toContain("Why it was cancelled");
});

test("a delegated plan names its worker, or says it is delegated", async () => {
    const element = drawn(PlanDetails, {plan: {...PLAN, delegated: true, agents: [{name: "Lovelace"}]}});
    await settle();
    expect(element.querySelector("[data-plan-delegated]")).not.toBeNull();
});

test("the phases list each task, and a task opens through the select event", async () => {
    const chosen = [];
    const element = drawn(PlanPhases, {phases: PLAN.phases, currentPhase: 2, onSelect: (id) => chosen.push(id)});
    await settle();
    expect([...element.querySelectorAll("[data-resource-task]")]).toHaveLength(3);
    element.querySelector("[data-resource-task]").click();
    expect(chosen).toEqual([7]);
});
