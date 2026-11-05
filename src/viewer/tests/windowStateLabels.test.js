import {beforeAll, expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {loadStates} from "../src/domain/states.js";
import TaskDock from "../../core/modules/tasks/web/src/TaskDock.vue";
import QuestionDock from "../../core/modules/questions/web/src/QuestionDock.vue";
import StateRows from "../kit/StateRows.vue";
import Outputs from "../../core/modules/processes/web/src/Outputs.vue";
import NudgeList from "../../core/modules/drivers/web/src/NudgeList.vue";
import HookCallList from "../../core/modules/drivers/web/src/HookCallList.vue";

beforeAll(() => loadStates(async () => ({ok: true, json: async () => ({states: {
    task: {reviewing: {label: "Under review", looks_like: "started"}},
    question: {checking: {label: "Checking the answer", looks_like: "open"}},
    process: {checking: {label: "Checking the result", looks_like: "running"}},
}})})));

test("a task dock draws an added state by its declared label", async () => {
    const window = context({"task show 3": {ok: true, value: {id: 3, state: "reviewing", title: "Check the cart"}}});
    window.option = () => ({value: {target_id: 3}});
    const element = await mounted(TaskDock, window);
    expect(element.querySelector(".task-dock-state").textContent).toBe("Under review");
});

test("shared state rows draw an added state for their declared model", async () => {
    const window = context({"task list": page([{id: 3, state: "reviewing", title: "Check the cart"}])});
    const element = await mounted(StateRows, window, {kind: "task", line: "task list", events: [], empty: "No tasks yet"});
    await settle();
    expect(element.querySelector(".state").textContent).toBe("Under review");
});

test("a question dock uses question state labels", async () => {
    const element = await mounted(QuestionDock, context({}), {row: {id: 2, state: "checking", text: "Is the cart ready?"}});
    expect(element.querySelector(".question-dock-state").textContent).toBe("Checking the answer");
});

test("command output uses process state labels", async () => {
    const element = await mounted(Outputs, context({"process feed": page([{id: 2, state: "checking", line: "check cart"}])}));
    expect(element.querySelector(".state").textContent).toBe("Checking the result");
});

test("instruction types have readable labels and keep their stored styling value", async () => {
    const element = await mounted(NudgeList, context({"nudge list": page([{id: 2, key: "cart", type: "steering", text: "Check the cart", delivery_count: 1}])}));
    expect(element.querySelector(".nudge-type").textContent).toBe("Instruction");
    expect(element.querySelector(".nudge-type").dataset.type).toBe("steering");
});

test("agent calls show their readable event label", async () => {
    const element = await mounted(HookCallList, context({"hook-call feed": page([{id: 2, hook: "pre_tool_use", tool: "Read", summary: "cart.py", answer: "allow"}])}, 7));
    expect(element.querySelector(".note").textContent).toBe("Before a tool runs");
});
