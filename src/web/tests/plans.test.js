import {beforeEach, expect, test, vi} from "vitest";

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
