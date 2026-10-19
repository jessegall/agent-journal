import {createApp, nextTick} from "vue";
import {expect, test, vi} from "vitest";

vi.mock("../src/api/client.js", () => ({api: {}, onWrite: vi.fn()}));

const {default: PlanPhase} = await import("../src/resource/PlanPhase.vue");

const task = (id, worker_id = null) => ({table: "tasks", id, title: `Task ${id}`, state: "open", finished_at: null, worker_id});

async function mounted(props) {
    const into = document.createElement("div");
    document.body.append(into);
    createApp(PlanPhase, props).mount(into);
    await nextTick();
    return into;
}

test("a phase shows a skeleton for each task still loading and for its workers until they arrive", async () => {
    const phase = {i: 1, title: "Members", task_ids: [1, 2, 3], rows: [task(1, 2)], waiting: 2};
    const loading = await mounted({phase, workers: [], workersLoaded: false});
    expect(loading.querySelectorAll(".line.bones").length).toBe(2);
    expect(loading.querySelector(".holders-loading")).not.toBeNull();
    const loaded = await mounted({
        phase: {...phase, rows: [task(1, 2), task(2), task(3)], waiting: 0},
        workers: [{id: 2, name: "Ada", state: "dispatched"}],
        workersLoaded: true,
    });
    expect(loaded.querySelectorAll(".line.bones").length).toBe(0);
    expect(loaded.querySelector(".holders-loading")).toBeNull();
    expect(loaded.textContent).toContain("Ada");
});
