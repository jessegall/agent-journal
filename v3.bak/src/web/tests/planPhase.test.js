import {createApp, nextTick} from "vue";
import {expect, test, vi} from "vitest";

vi.mock("../src/api/client.js", () => ({api: {}, onWrite: vi.fn(), onBlocked: vi.fn()}));

const {default: PlanPhase} = await import("../src/resource/PlanPhase.vue");

const todo = (n, assigned = "") => ({type: "todo", n, title: `To-do ${n}`, completed: 0, data: {assigned}});

async function mounted(props) {
    const into = document.createElement("div");
    document.body.append(into);
    createApp(PlanPhase, props).mount(into);
    await nextTick();
    return into;
}

test("a phase shows a skeleton for each row still loading and for its agents until the helpers arrive", async () => {
    const phase = {i: 1, title: "Members", todos: [1, 2, 3], rows: [todo(1, "helper:2")], waiting: 2};
    const loading = await mounted({phase, helpers: [], helpersLoaded: false});
    expect(loading.querySelectorAll(".line.bones").length).toBe(2);
    expect(loading.querySelector(".holders-loading")).not.toBeNull();
    const loaded = await mounted({
        phase: {...phase, rows: [todo(1, "helper:2"), todo(2), todo(3)], waiting: 0},
        helpers: [{n: 2, data: {name: "Ada"}}],
        helpersLoaded: true,
    });
    expect(loaded.querySelectorAll(".line.bones").length).toBe(0);
    expect(loaded.querySelector(".holders-loading")).toBeNull();
});
