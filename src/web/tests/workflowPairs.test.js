import {describe, expect, it} from "vitest";
import {MARKS, fixedLinesOf, markOf, pairs, statusOf} from "../src/domain/workflowPairs.js";

const states = [
    {key: "idle", title: "Idle", parent: ""},
    {key: "working", title: "Working", parent: ""},
    {key: "following_plan", title: "Following a plan", parent: "working"},
];
const catalogue = [
    {kind: "trigger", key: "idle", title: "Agent stops", group: "", providers: ["claude", "codex"]},
    {kind: "trigger", key: "ticked", title: "Clock ticks", group: "", providers: ["claude", "codex"]},
    {kind: "trigger", key: "tasks.created", title: "A task is created", group: "task", providers: ["claude", "codex"]},
    {kind: "trigger", key: "plans.created", title: "A plan is created", group: "plan", providers: ["claude", "codex"]},
    {kind: "check", key: "open_tasks", title: "Has open tasks?", group: ""},
];
const shipped = (id, state, event, place, more = {}) => ({
    id,
    state,
    event,
    place,
    shipped: true,
    edited: false,
    off: false,
    failed: false,
    warnings: [],
    ...more,
});
const workflows = [
    shipped(1, "idle", "idle", 2),
    shipped(2, "working", "idle", 1, {edited: true}),
    shipped(3, "working", "tasks.created", 0, {off: true}),
    {...shipped(4, "following_plan", "ticked", 0), shipped: false},
    shipped(5, "", "idle", 0),
];

describe("an event's workflows in the order they run", () => {
    const paired = pairs(workflows, states, catalogue);

    it("lists an event's workflows by place, every state's together", () => {
        expect(paired.answering("idle").map((w) => w.id)).toEqual([5, 2, 1]);
    });

    it("filtered on a state, shows the stateless ones and the nearest state's in the lineage", () => {
        expect(paired.listFor("idle", "idle").map((w) => w.id)).toEqual([5, 1]);
        expect(paired.listFor("idle", "following_plan").map((w) => w.id)).toEqual([5, 2]);
        expect(paired.listFor("ticked", "following_plan").map((w) => w.id)).toEqual([4]);
        expect(paired.listFor("ticked", "idle")).toEqual([]);
    });

    it("lists every agent event and the row events something answers; the rest can be added", () => {
        expect(paired.events().map((e) => e.key)).toEqual(["idle", "ticked", "tasks.created"]);
        expect(paired.addable().map((e) => e.key)).toEqual(["plans.created"]);
    });

    it("says when a workflow runs and what a row says about it", () => {
        expect(paired.whoOf(workflows[4])).toBe("always");
        expect(paired.whoOf(workflows[3])).toBe("when the agent is following a plan");
        expect(statusOf(workflows[1])).toBe("Changed by you");
        expect(statusOf(workflows[2])).toBe("Turned off");
        expect(statusOf(workflows[4])).toBe("");
    });

    it("names the engine's own moves at an event, and none where it makes none", () => {
        const fixed = {"tasks.updated": ["the journal itself moves the agent to Working when it starts a task"]};
        expect(fixedLinesOf(fixed, "tasks.updated")).toEqual(["the journal itself moves the agent to Working when it starts a task"]);
        expect(fixedLinesOf(fixed, "idle")).toEqual([]);
        expect(fixedLinesOf(undefined, "idle")).toEqual([]);
    });

    it("marks a row by what was done to it", () => {
        expect(markOf(workflows[0])).toBe("default");
        expect(markOf(workflows[1])).toBe("yours");
        expect(markOf(workflows[2])).toBe("off");
        expect(markOf(null)).toBe("none");
        expect(MARKS.map((m) => m.mark)).toEqual(["default", "yours", "off", "failed", "none"]);
    });
});
