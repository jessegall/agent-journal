import {expect, test} from "vitest";
import Points from "../../suites/coding/modules/workers/web/src/Points.vue";
import Todos from "../../suites/coding/modules/workers/web/src/Todos.vue";
import {context, drawn, page} from "./support/windowContext.js";

const pointsContext = (answers, agent) => context(answers, agent, {
    points: {line: "worker-worktree points", events: ["proof.*", "worker_worktree.*"]},
});

test("the points window shows each point of the worker's brief with its proof, in one read", async () => {
    const windowContext = pointsContext(
        {
            "worker-worktree points": {
                ok: true,
                value: {
                    points: [
                        {id: 1, text: "the total adds the tax", proof: {point: 1, state: "checked", text: "cart.py:1, the tax story", shortfall: ""}},
                        {id: 2, text: "the total rounds to cents", proof: null},
                    ],
                },
            },
        },
        2,
    );
    const text = await drawn(Points, windowContext);
    expect(text).toContain("the total adds the tax");
    expect(text).toContain("checked: cart.py:1, the tax story");
    expect(text).toContain("no proof yet");
    expect(windowContext.reads).toEqual(["worker-worktree points --agent 2"]);
});

test("the points window of an agent with no worktree says so", async () => {
    const text = await drawn(Points, pointsContext({"worker-worktree points": {ok: true, value: {points: []}}}, 2));
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
