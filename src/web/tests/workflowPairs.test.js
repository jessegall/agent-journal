import {describe, expect, it} from "vitest";
import {MARKS, markOf, pairs, statusOf} from "../src/domain/workflowPairs.js";

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
const shipped = (id, state, event, more = {}) => ({
    id,
    state,
    event,
    shipped: true,
    edited: false,
    off: false,
    failed: false,
    warnings: [],
    ...more,
});
const workflows = [
    shipped(1, "idle", "idle"),
    shipped(2, "working", "idle", {edited: true}),
    shipped(3, "working", "tasks.created", {off: true}),
    {...shipped(4, "following_plan", "ticked"), shipped: false},
];

describe("one workflow per state per event", () => {
    const paired = pairs(workflows, states, catalogue);

    it("answers an event with the state's own workflow, or its parent's where it has none", () => {
        expect(paired.ownFor("working", "idle").id).toBe(2);
        expect(paired.servingFor("following_plan", "idle").id).toBe(2);
        expect(paired.ownFor("following_plan", "idle")).toBeNull();
        expect(paired.servingFor("following_plan", "ticked").id).toBe(4);
        expect(paired.servingFor("idle", "ticked")).toBeNull();
    });

    it("lists every agent event and only the row events the state or its parent answers", () => {
        expect(paired.eventsFor("idle").map((e) => e.key)).toEqual(["idle", "ticked"]);
        expect(paired.eventsFor("following_plan").map((e) => e.key)).toEqual(["idle", "ticked", "tasks.created"]);
        expect(paired.addableFor("working").map((e) => e.key)).toEqual(["plans.created"]);
    });

    it("words the rows by the one thing that sets them apart", () => {
        expect(paired.wordsFor("working", "idle")).toBe("Changed by you");
        expect(paired.wordsFor("working", "tasks.created")).toBe("Turned off");
        expect(paired.wordsFor("following_plan", "idle")).toBe("Working's");
        expect(paired.wordsFor("idle", "idle")).toBe("");
        expect(paired.wordsFor("idle", "ticked")).toBe("");
    });

    it("marks a default, yours, off, failed, borrowed and none, each named in the key", () => {
        expect(markOf(workflows[0], false)).toBe("default");
        expect(markOf(workflows[1], false)).toBe("yours");
        expect(markOf(workflows[2], false)).toBe("off");
        expect(markOf(shipped(9, "idle", "idle", {failed: true}), false)).toBe("failed");
        expect(markOf(workflows[1], true)).toBe("borrowed");
        expect(markOf(null, false)).toBe("none");
        expect(MARKS.map((m) => m.mark)).toEqual(["default", "yours", "off", "failed", "borrowed", "none"]);
        expect(statusOf(workflows[3])).toBe("Made by you");
    });
});
