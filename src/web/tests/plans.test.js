import {beforeEach, expect, test, vi} from "vitest";
import {momentDays} from "../src/domain/timeline.js";

const api = {act: vi.fn(), dashboard: vi.fn(), env: () => "main"};
vi.mock("../src/api/client.js", () => ({api, onWrite: vi.fn()}));
vi.mock("../src/chat/outbox.js", () => ({onOutboxChange: vi.fn()}));
vi.mock("../src/domain/spec.js", () => ({word: (type, method) => ({approve: "approved", start: "started"})[method] || method}));

const {approvePlan, parkPlan, startPlan} = await import("../src/actions/plans.js");
const {rows} = await import("../src/sync/rows.js");
const {store} = await import("../src/state/store.js");

const plan = (n, status) => ({n, type: "plan", ref: `plan:${n}`, data: {status}});
const statuses = () => rows("plan").map((p) => p.data.status);

beforeEach(() => {
    api.act.mockReset().mockResolvedValue({});
    api.dashboard.mockReset().mockResolvedValue({counts: {}, rows: {plan: {rows: [plan(1, "active"), plan(2, "approved")], more: false}}});
    store.booted = true;
    store.rows.plan = [plan(1, "active"), plan(2, "waiting"), plan(3, "building")];
    store.paging = {size: {}, more: {}};
});

test("approving a plan shows it approved at once and asks the server by the type's own word", async () => {
    const [, , building] = rows("plan");
    const sending = approvePlan(building);
    expect(building.data.status).toBe("approved");
    await sending;
    expect(api.act).toHaveBeenCalledWith("plan", 3, "approved");
});

test("starting a plan parks the running and waiting ones before the server answers", async () => {
    const [, , building] = rows("plan");
    const sending = startPlan(building);
    expect(statuses()).toEqual(["parked", "parked", "active"]);
    await sending;
    expect(api.act).toHaveBeenCalledWith("plan", 3, "started");
});

test("a refused approval is passed on and the rows are read again, so the card does not stay approved", async () => {
    api.act.mockRejectedValue(new Error("not yet"));
    const [, , building] = rows("plan");
    await expect(approvePlan(building)).rejects.toThrow("not yet");
    expect(api.dashboard).toHaveBeenCalled();
    expect(statuses()).toEqual(["active", "approved"]);
});

test("parking a plan marks it parked", async () => {
    const [first] = rows("plan");
    await parkPlan(first);
    expect(first.data.status).toBe("parked");
});

test("a plan's timeline groups its moments by day, newest first", () => {
    const day = 86400;
    const moments = [
        {at: 10 * day + 60, kind: "started", todo: 1},
        {at: 10 * day + 120, kind: "done", todo: 1},
        {at: 12 * day + 60, kind: "started", todo: 2},
    ];
    const days = momentDays(moments);
    expect(days.map((one) => one.items.map((item) => item.todo))).toEqual([[2], [1, 1]]);
    expect(days[1].items.map((item) => item.kind)).toEqual(["done", "started"]);
});

test("each running plan gets a bar, the one you work first and delegated ones after it, three at most", async () => {
    const {barPlans, foldedPlans, othersLine} = await import("../src/domain/plans.js");
    const made = (n, status, delegated = false) => ({n, type: "plan", data: {status, delegated, phases: [], current: 1}});
    const plans = [made(1, "active", true), made(2, "active"), made(3, "active", true), made(4, "active", true), made(5, "parked")];
    expect(barPlans(plans).map((p) => p.n)).toEqual([2, 1, 3]);
    expect(foldedPlans(plans).map((p) => p.n)).toEqual([4, 5]);
    expect(othersLine(foldedPlans(plans))).toBe("+1 more active plan · 1 paused");
    expect(barPlans(plans.slice(0, 3)).map((p) => p.n)).toEqual([2, 1, 3]);
});

test("a delegated plan names its helpers with their jobs and branches, or the agent on its ticket", async () => {
    const {delegationOf, withLine} = await import("../src/domain/plans.js");
    const plan = {n: 1, data: {delegated: true, current: 1, phases: [{todos: [10, 11], tickets: [41]}]}};
    const todos = [
        {n: 10, completed: 0, data: {assigned: "helper:3"}},
        {n: 11, completed: 0, data: {assigned: "helper:4"}},
    ];
    const helpers = [
        {n: 3, title: "Fix the tunnel", data: {name: "Hedy"}},
        {n: 4, title: "Test it", data: {name: "Benny"}},
    ];
    const worktrees = [{completed: 0, data: {helper: "Hedy", branch: "helper/hedy"}}];
    const seen = delegationOf(plan, {todos, helpers, worktrees, tickets: []});
    expect(seen.line).toBe("Helpers: Hedy, Benny");
    expect(seen.helpers[0]).toMatchObject({name: "Hedy", job: "Fix the tunnel", branch: "helper/hedy"});
    expect(withLine(["Hedy"], [])).toBe("Helper: Hedy");
    expect([withLine([], [12, 13]), withLine([], [])]).toEqual(["Tickets: 12, 13", "Delegated"]);
    expect(delegationOf(plan, {todos: [], helpers: [], worktrees: [], tickets: [{n: 41, completed: 0}]}).line).toBe("Ticket: 41");
    expect(delegationOf({...plan, data: {...plan.data, delegated: false}}, {todos, helpers, worktrees, tickets: []})).toBe(null);
});

test("the plan card never counts the plan it shows among the other plans", async () => {
    const {otherPlans, othersLine} = await import("../src/domain/plans.js");
    const made = (n, status) => ({n, type: "plan", data: {status, phases: [], current: 1}});
    const plans = [made(34, "active"), made(35, "building")];
    expect(otherPlans(plans, {...plans[1]}).map((p) => p.n)).toEqual([34]);
    expect(othersLine(otherPlans(plans, plans[1]))).toBe("+1 more active plan");
});

test("a plan under review offers no Approve button until its review is in and it is ready again", async () => {
    const {planButton} = await import("../src/domain/plans.js");
    const made = (status) => ({n: 35, type: "plan", completed: 0, data: {status, phases: [], current: 1}});
    expect(planButton(made("reviewing"))).toBe(null);
    expect(planButton(made("ready"))).toEqual(["approve", "Approve"]);
});

test("a plan offers the choices of the review reports linked to it that wait on one, newest first", async () => {
    const {reviewChoices} = await import("../src/domain/plans.js");
    const choice = [{label: "Revise the plan", say: "Revise it", choice: "next"}, {label: "Keep it", say: "Keep it", choice: "next"}];
    const report = (n, extra = {}) => ({n, created: n, deleted: 0, refs: ["plan:35"], data: {buttons: choice}, ...extra});
    const reports = [report(125), report(126), report(124, {data: {buttons: choice, pressed: ["Keep it"]}}), report(127, {refs: ["plan:34"]})];
    expect(reviewChoices({n: 35}, reports).map((r) => r.n)).toEqual([126, 125]);
});
