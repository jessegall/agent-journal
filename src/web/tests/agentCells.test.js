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
    expect(cells.map((c) => [c.kind, c.model, c.doing])).toEqual([["helper", "claude-sonnet-5-5", ""], ["subagent", "claude-haiku-5-5", "Explore"]]);
});

test("a cell shows what the agent said and the plain line of what it does, never a tool name", () => {
    const working = {name: "main", owner: "helper:3", agent: {tool: "Bash", file: "", says: "The cover now keeps its version.", doing: "Reading orchestra.js"}, counts: {}, plans: [], subagents: []};
    const [cell] = orchestraOf([working], [], 1000);
    expect([cell.says, cell.doing, JSON.stringify(cell)]).toEqual(["The cover now keeps its version.", "Reading orchestra.js", expect.not.stringContaining("Bash")]);
});

test("a cell whose plan is ready but waits on an open ticket says the plan is approved and waits on that ticket", async () => {
    const {store} = await import("../src/state/store.js");
    store.rows = {...store.rows, ticket: [{n: 20, completed: 0, deleted: 0, data: {dependencies: {"ticket:26": "confirmed"}}}, {n: 26, completed: 0, deleted: 0, data: {}}]};
    const environment = {name: "ticket-20", owner: "ticket:20", agent: {}, counts: {}, plans: [{status: "ready"}], subagents: []};
    const [waiting] = orchestraOf([environment], [], 1000);
    expect(waiting.card.reason).toBe("its plan is approved, waiting on ticket 26");
    store.rows = {...store.rows, ticket: [{n: 20, completed: 0, deleted: 0, data: {dependencies: {"ticket:26": "confirmed"}}}, {n: 26, completed: 5, deleted: 0, data: {}}]};
    expect(orchestraOf([environment], [], 1000)[0].card.reason).toBe("its plan waits for your approval");
});
