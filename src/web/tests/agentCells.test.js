import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import JobTimer from "../src/kit/JobTimer.vue";
import {orchestraOf, ordered, slotsFor} from "../src/domain/orchestra.js";

const agent = (kind, n) => ({key: `${kind}:${n}`, kind, n});

test("agents take their cells by number, and a new agent joins at the end whatever its number", () => {
    const first = [agent("ticket", 7), agent("ticket", 3), agent("plan", 5)];
    const slots = slotsFor([], first);
    expect(ordered(first, "number", slots).map((e) => e.key)).toEqual(["ticket:3", "plan:5", "ticket:7"]);
    const joined = [...first, agent("ticket", 1)];
    const kept = slotsFor(slots, joined);
    expect(ordered(joined, "number", kept).map((e) => e.key)).toEqual(["ticket:3", "plan:5", "ticket:7", "ticket:1"]);
});

test("a state change moves no cell, and a hidden agent keeps its place for when it shows again", () => {
    const all = [agent("ticket", 2), agent("ticket", 4), agent("ticket", 6)];
    const slots = slotsFor([], all);
    const changed = all.map((e) => ({...e, at: e.n === 6 ? 999 : 1, state: e.n === 2 ? "idle" : "working"}));
    expect(ordered(changed, "number", slots).map((e) => e.n)).toEqual([2, 4, 6]);
    expect(ordered([all[2], all[0]], "number", slots).map((e) => e.n)).toEqual([2, 6]);
});

test("the timer shows how long the agent has been on its current job", async () => {
    const into = document.createElement("div");
    createApp({render: () => h(JobTimer, {since: Date.now() / 1000 - 3725})}).mount(into);
    await nextTick();
    expect(into.textContent).toMatch(/^1h 02m 0\ds$/);
});

test("every cell carries its model, whether or not a tool is running", () => {
    const quiet = {name: "main", owner: "", agent: {model: "claude-sonnet-5-5"}, counts: {}, plans: [], subagents: [{session: "s", parent: 1, type: "Explore", model: "claude-haiku-5-5", running: true}]};
    const cells = orchestraOf([{...quiet, owner: "helper:3"}], [], 1000);
    expect(cells.map((c) => [c.kind, c.model, c.now])).toEqual([["helper", "claude-sonnet-5-5", ""], ["subagent", "claude-haiku-5-5", "Explore"]]);
});
