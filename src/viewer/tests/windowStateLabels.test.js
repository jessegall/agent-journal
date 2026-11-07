import {planWindowContext} from "./support/planWindowContext.js";
import {beforeAll, expect, test} from "vitest";
import {context, mounted, mountedDock, page, settle} from "./support/windowContext.js";
import {loadStates} from "../src/domain/states.js";
import TaskDock from "../../core/modules/tasks/web/src/TaskDock.vue";
import QuestionDock from "../../core/modules/questions/web/src/QuestionDock.vue";
import StateRows from "../kit/StateRows.vue";
import {commandsWindowContext} from "./support/commandsWindowContext.js";
import Outputs from "../../core/modules/processes/web/src/Outputs.vue";
import NudgeList from "../../core/modules/drivers/web/src/NudgeList.vue";
import HookCallList from "../../core/modules/drivers/web/src/HookCallList.vue";
import PlanCards from "../../core/modules/plans/web/src/PlanCards.vue";

beforeAll(() => loadStates(async () => ({ok: true, json: async () => ({states: {
    task: {reviewing: {label: "Under review", looks_like: "started"}},
    question: {checking: {label: "Checking the answer", looks_like: "open"}},
    process: {checking: {label: "Checking the result", looks_like: "running"}},
    plan: {reviewing: {label: "Review required", looks_like: "reviewing"}},
}})})));

test("a task dock draws an added state by its declared label", async () => {
    const window = context({"task show 3": {ok: true, value: {id: 3, state: "reviewing", title: "Check the cart"}}});
    const element = await mountedDock(TaskDock, window, {target_id: 3});
    expect(element.querySelector("footer").textContent).toBe("Task: under review");
});

test("shared state rows draw an added state for their declared model", async () => {
    const window = context({"task list": page([{id: 3, state: "reviewing", title: "Check the cart"}])});
    const element = await mounted(StateRows, window, {noun: "task", line: "task list", events: [], empty: "No tasks yet"});
    await settle();
    expect(element.querySelector(".state").textContent).toBe("Under review");
});

test("a question dock uses question state labels", async () => {
    const window = context({"question show 2": {ok: true, value: {id: 2, state: "checking", text: "Is the cart ready?"}}});
    const element = await mountedDock(QuestionDock, window, {target_id: 2});
    expect(element.querySelector("footer").textContent).toBe("Question: checking the answer");
});

test("command output uses process state labels", async () => {
    const element = await mounted(Outputs, commandsWindowContext({"process feed": page([{id: 2, state: "checking", line: "check cart"}])}));
    expect(element.querySelector(".state").textContent).toBe("Checking the result");
});

test("instruction types have readable labels and keep their stored styling value", async () => {
    const element = await mounted(NudgeList, context({"nudge list": page([{id: 2, key: "cart", type: "steering", text: "Check the cart", delivery_count: 1}])}, null, {
        nudges: {line: "nudge list", events: ["nudge_record.*"]},
    }));
    expect(element.querySelector(".nudge-type").textContent).toBe("Instruction");
    expect(element.querySelector(".nudge-type").dataset.type).toBe("steering");
});

test("agent calls show their readable event label", async () => {
    const element = await mounted(HookCallList, context({"hook-call feed": page([{id: 2, hook: "pre_tool_use", tool: "Read", summary: "cart.py", answer: "allow"}])}, 7));
    expect(element.querySelector(".note").textContent).toBe("Before a tool runs");
});

test.each([["reviewing", "Review required"], ["approved", "Approved"]])("plan cards label %s and retain its styling", async (state, label) => {
    const window = planWindowContext({"plan board": {ok: true, value: {open_total: 1, closed_total: 0, plans: [{id: 3, title: "Cart", state, task_count: 0, completed_count: 0, current_phase: 0}]}}});
    window.tabs = [{key: "open", label: "Open", read: "plan board", count_field: "open_total"}];
    const element = await mounted(PlanCards, window);
    const badge = element.querySelector("[data-plan-state]");
    expect(badge.textContent).toBe(label);
    expect(badge.classList.contains(state)).toBe(true);
});
