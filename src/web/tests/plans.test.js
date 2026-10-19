import {beforeEach, expect, test, vi} from "vitest";

const api = {act: vi.fn(), list: vi.fn(), env: () => "main"};
vi.mock("../src/api/client.js", () => ({api, onWrite: vi.fn()}));
vi.mock("../src/chat/outbox.js", () => ({onOutboxChange: vi.fn()}));

const {approvePlan, parkPlan, startPlan} = await import("../src/actions/plans.js");
const {rows} = await import("../src/sync/rows.js");
const {store} = await import("../src/state/store.js");

const plan = (id, state, more = {}) => ({table: "plans", id, state, phases: [], task_ids: [], current_phase: 1, held: false, delegated: false, ...more});
const states = () => rows("plans").map((p) => p.state);

beforeEach(() => {
    api.act.mockReset().mockResolvedValue({});
    api.list.mockReset().mockResolvedValue({counts: {}, rows: [plan(1, "started"), plan(2, "approved")], more: false});
    store.booted = true;
    store.rows.plans = [plan(1, "started"), plan(2, "started", {held: true}), plan(3, "ready")];
    store.paging = {size: {}, more: {}};
});

test("approving a plan shows it approved at once and asks the server by the act's name", async () => {
    const [, , ready] = rows("plans");
    const sending = approvePlan(ready);
    expect(ready.state).toBe("approved");
    await sending;
    expect(api.act).toHaveBeenCalledWith("plans", 3, "approve");
});

test("starting a plan parks the started ones before the server answers", async () => {
    const [, , ready] = rows("plans");
    const sending = startPlan(ready);
    expect(states()).toEqual(["parked", "parked", "started"]);
    await sending;
    expect(api.act).toHaveBeenCalledWith("plans", 3, "start");
});

test("a refused approval is passed on and the rows are read again, so the card does not stay approved", async () => {
    api.act.mockRejectedValue(new Error("not yet"));
    const [, , ready] = rows("plans");
    await expect(approvePlan(ready)).rejects.toThrow("not yet");
    expect(api.list).toHaveBeenCalled();
    await vi.waitFor(() => expect(states()).toEqual(["started", "approved"]));
});

test("parking a plan marks it parked", async () => {
    const [first] = rows("plans");
    await parkPlan(first);
    expect(first.state).toBe("parked");
});

test("each running plan gets a bar, the one you work first and delegated ones after it, three at most", async () => {
    const {barPlans, foldedPlans, othersLine} = await import("../src/domain/plans.js");
    const plans = [plan(1, "started", {delegated: true}), plan(2, "started"), plan(3, "started", {delegated: true}), plan(4, "started", {delegated: true}), plan(5, "parked")];
    expect(barPlans(plans).map((p) => p.id)).toEqual([2, 1, 3]);
    expect(foldedPlans(plans).map((p) => p.id)).toEqual([4, 5]);
    expect(othersLine(foldedPlans(plans))).toBe("+1 more active plan · 1 paused");
});

test("a delegated plan names the workers that hold the open tasks of the phase in hand", async () => {
    const {delegationOf} = await import("../src/domain/plans.js");
    const delegated = plan(1, "started", {delegated: true, phases: [{title: "One", task_ids: [10, 11]}]});
    const tasks = [
        {id: 10, state: "started", finished_at: null, worker_id: 3},
        {id: 11, state: "open", finished_at: null, worker_id: 4},
    ];
    const workers = [
        {id: 3, name: "Hedy", brief: "Fix the tunnel", worktree: true},
        {id: 4, name: "Benny", brief: "Test it", worktree: false},
    ];
    const seen = delegationOf(delegated, {tasks, workers});
    expect(seen.line).toBe("Workers: Hedy, Benny");
    expect(seen.workers[0]).toMatchObject({name: "Hedy", job: "Fix the tunnel"});
    expect(delegationOf({...delegated, delegated: false}, {tasks, workers})).toBe(null);
});

test("the plan card never counts the plan it shows among the other plans", async () => {
    const {otherPlans, othersLine} = await import("../src/domain/plans.js");
    const plans = [plan(34, "started"), plan(35, "draft")];
    expect(otherPlans(plans, {...plans[1]}).map((p) => p.id)).toEqual([34]);
    expect(othersLine(otherPlans(plans, plans[1]))).toBe("+1 more active plan");
});

test("a plan under review offers no Approve button until its review is in and it is ready again", async () => {
    const {planButton} = await import("../src/domain/plans.js");
    expect(planButton(plan(35, "reviewing"))).toBe(null);
    expect(planButton(plan(35, "ready"))).toEqual(["approve", "Approve"]);
});

test("a started plan held at a checkpoint stands as waiting on you", async () => {
    const {statusOf} = await import("../src/domain/plans.js");
    expect([statusOf(plan(1, "started", {held: true})), statusOf(plan(1, "started")), statusOf(plan(1, "blocked"))]).toEqual(["waiting", "started", "blocked"]);
});
