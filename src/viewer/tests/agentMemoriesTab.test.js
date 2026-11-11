import {afterEach, expect, test, vi} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import AgentMemories from "../../core/modules/memories/web/src/AgentMemories.vue";

afterEach(() => { document.body.innerHTML = ""; });

const KEYS = {
    "agent-memories.*": {line: "memory page --agent {id} --state active --order weight --limit 100", tab: "memories", events: ["memory.*"], loading: "requested"},
    "agent-removed-memories.*": {line: "memory page --agent {id} --removed --state removed --order weight --limit 100", tab: "memories", events: ["memory.*"], loading: "requested"},
};
const KEPT = [
    {id: 11, text: "The queue is on", weight: 8, state: "active", task_id: 9002, reason: ""},
    {id: 12, text: "My worktree is clean", weight: 3, state: "active", task_id: null, reason: ""},
];
const REMOVED = [{id: 13, text: "An old fact", weight: 1, state: "removed", task_id: null, reason: "faded to weight 0"}];
const ACTIVE_LINE = "memory page --agent 646 --state active --order weight --limit 100";
const REMOVED_LINE = "memory page --agent 646 --removed --state removed --order weight --limit 100";
const drawn = (answers) => mounted(AgentMemories, context(answers, null, KEYS), {agent: 646});

test("the memories tab lists the memories in force with their state and weight, and folds the removed ones", async () => {
    const element = await drawn({[ACTIVE_LINE]: page(KEPT), [REMOVED_LINE]: page(REMOVED)});
    await vi.waitFor(() => expect(element.querySelectorAll("[data-memory]").length).toBe(2));
    expect(element.querySelector("[data-agent-memories-active]").textContent).toBe("Active: 2");
    const first = element.querySelector('[data-memory="11"]');
    expect(first.querySelector("[data-memory-state]").textContent).toBe("State: Active");
    expect(first.querySelector("[data-memory-weight]").textContent).toContain("Weight: 8 of 10");
    expect(first.querySelectorAll(".steps i.on").length).toBe(8);
    expect(first.textContent).toContain("Task 9002");
    expect(element.textContent).not.toContain("Kept");
    expect(element.querySelector("[data-agent-memories-removed]").textContent).toContain("Removed: 1");
    expect(element.querySelector('[data-memory="13"]')).toBeNull();
});

test("opening the removed fold shows each removed memory with its reason", async () => {
    const element = await drawn({[ACTIVE_LINE]: page(KEPT), [REMOVED_LINE]: page(REMOVED)});
    await vi.waitFor(() => expect(element.querySelector("[data-agent-memories-removed] button")).not.toBeNull());
    element.querySelector("[data-agent-memories-removed] button").click();
    await settle();
    const removed = element.querySelector('[data-memory="13"]');
    expect(removed.querySelector("[data-memory-state]").textContent).toBe("State: Removed");
    expect(removed.textContent).toContain("Reason: faded to weight 0");
});

test("an agent with no memories says so", async () => {
    const element = await drawn({[ACTIVE_LINE]: page([]), [REMOVED_LINE]: page([])});
    await vi.waitFor(() => expect(element.textContent).toContain("No memories"));
    expect(element.textContent).toContain("This agent has not made any, and none were given to it.");
});

test("a read that fails says so and reads again when asked", async () => {
    const answers = {[ACTIVE_LINE]: {ok: false, failure: "refused", error: "the journal did not answer"}, [REMOVED_LINE]: page(REMOVED)};
    const element = await drawn(answers);
    await vi.waitFor(() => expect(element.querySelector("[data-agent-memories-failure]")).not.toBeNull());
    expect(element.querySelector("[data-agent-memories-failure]").textContent).toContain("Could not read the memories of this agent: the journal did not answer.");
    expect(element.querySelector("[data-agent-memories-retry]")).not.toBeNull();
});
