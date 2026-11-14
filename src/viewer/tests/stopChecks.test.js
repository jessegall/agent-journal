import {expect, test} from "vitest";
import {mounted} from "./support/windowContext.js";
import {activityWindowContext} from "./support/activityWindowContext.js";
import HookCallList from "../../core/modules/drivers/web/src/HookCallList.vue";

test("an agent's Activity shows each stop check and reason from its existing feed", async () => {
    const window = activityWindowContext({"hook-call feed": {ok: true, value: {rows: [{id: 9, hook: "stop", tool: "", summary: "", answer: "refused", refusal: "task:1 is in hand", stop_checks: [
        {rule: "tasks.carry-on-at-stop", outcome: "refused", reason: "task:1 is in hand", applied: true},
        {rule: "messages.unread-at-stop", outcome: "allowed", reason: "the agent has no unread user message", applied: false},
    ]}]}}}, 7);
    const element = await mounted(HookCallList, window);
    expect(window.reads).toEqual(["hook-call feed --session-agent-id 7 --limit 50"]);
    element.querySelector("summary:not(.summary)").click();
    expect(element.querySelectorAll("[data-stop-check]")).toHaveLength(2);
    expect(element.textContent).toContain("task:1 is in hand");
    expect(element.textContent).toContain("the agent has no unread user message");
    expect(element.textContent).toContain("Not applied");
});

test("a stop check names its rule and its outcome in plain words", async () => {
    const window = activityWindowContext({"hook-call feed": {ok: true, value: {rows: [{id: 9, hook: "stop", tool: "", summary: "", answer: "refused", refusal: "task:1 is in hand", stop_checks: [
        {rule: "messages.unread-at-stop", outcome: "refused", reason: "an unread message", applied: true},
        {rule: "tasks.carry-on-at-stop", outcome: "disabled", reason: "the rule is switched off", applied: false},
    ]}]}}}, 7);
    const element = await mounted(HookCallList, window);
    element.querySelector("summary:not(.summary)").click();
    const checks = [...element.querySelectorAll("[data-stop-check]")].map((check) => check.querySelector("strong").textContent + check.querySelector("span").textContent);
    expect(checks).toEqual(["Messages: unread at stopRefused", "Tasks: carry on at stopSwitched off"]);
});

test("older activity entries without a stop record keep their ordinary summary", async () => {
    const window = activityWindowContext({"hook-call feed": {ok: true, value: {rows: [{id: 1, hook: "stop", summary: "", tool: "", answer: "allowed", refusal: "", stop_checks: []}]}}}, 7);
    const element = await mounted(HookCallList, window);
    expect(element.querySelector("[data-stop-checks]")).toBeNull();
    expect(element.textContent).toContain("allowed");
});
