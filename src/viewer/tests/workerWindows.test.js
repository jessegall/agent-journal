import {expect, test} from "vitest";
import Points from "../../suites/coding/modules/workers/web/src/Points.vue";
import Todos from "../../suites/coding/modules/workers/web/src/Todos.vue";
import {context, drawn, page} from "./support/windowContext.js";

test("the points window shows each point of the worker's brief with its proof", async () => {
    const windowContext = context(
        {
            "worker-worktree list": page([{id: 1, task_id: 4}]),
            "task show": {ok: true, value: {id: 4, title: "Fix the cart", brief: "- the total adds the tax\n- the total rounds to cents"}},
            "proof list": page([{id: 1, point: 1, state: "checked", text: "cart.py:1, the tax story", shortfall: ""}]),
        },
        2,
    );
    const text = await drawn(Points, windowContext);
    expect(text).toContain("the total adds the tax");
    expect(text).toContain("checked: cart.py:1, the tax story");
    expect(text).toContain("no proof yet");
    expect(windowContext.reads).toContain("worker-worktree list --agent 2");
    expect(windowContext.reads).toContain("proof list --worktree 1");
});

test("the points window of an agent with no worktree says so", async () => {
    const text = await drawn(Points, context({"worker-worktree list": page([])}, 2));
    expect(text).toContain("This agent has no task brief to prove");
});

test("the to-do list window shows its agent's items in order with their state", async () => {
    const windowContext = context({"todo-item list": page([{id: 1, text: "Add the tax", state: "completed"}, {id: 2, text: "Round to cents", state: "in_progress"}])}, 2);
    const text = await drawn(Todos, windowContext);
    expect(text).toContain("Add the tax");
    expect(text).toContain("done");
    expect(text).toContain("doing");
    expect(windowContext.reads[0]).toBe("todo-item list --agent 2 --oldest");
});
