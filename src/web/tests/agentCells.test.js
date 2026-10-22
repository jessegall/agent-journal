import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import JobTimer from "../src/kit/JobTimer.vue";
import {orchestraOf, ordered, slotsFor} from "../src/domain/orchestra.js";
import {store} from "../src/state/store.js";

const cell = (kind, n) => ({key: `${kind}:${n}`, kind, n, card: {state: "working"}});
const at = (seconds) => new Date(seconds * 1000).toISOString();

test("agents take their cells by number, and a new agent joins at the end whatever its number", () => {
    const first = [cell("worker", 7), cell("worker", 3), cell("environment", 5)];
    const slots = slotsFor([], first);
    expect(ordered(first, "number", slots).map((e) => e.key)).toEqual(["worker:3", "environment:5", "worker:7"]);
    const joined = [...first, cell("worker", 1)];
    const kept = slotsFor(slots, joined);
    expect(ordered(joined, "number", kept).map((e) => e.key)).toEqual(["worker:3", "environment:5", "worker:7", "worker:1"]);
});

test("among agents of one standing a newer activity moves no cell, and a hidden agent keeps its place for when it shows again", () => {
    const all = [cell("worker", 2), cell("worker", 4), cell("worker", 6)];
    const slots = slotsFor([], all);
    const changed = all.map((e) => ({...e, time: e.n === 6 ? 999 : 1}));
    expect(ordered(changed, "number", slots).map((e) => e.n)).toEqual([2, 4, 6]);
    expect(ordered([all[2], all[0]], "number", slots).map((e) => e.n)).toEqual([2, 6]);
});

test("the timer shows how long the agent has been on its current job", async () => {
    const into = document.createElement("div");
    createApp({render: () => h(JobTimer, {since: Date.now() / 1000 - 3725})}).mount(into);
    await nextTick();
    expect(into.textContent).toMatch(/^1h 02m 0\ds$/);
});

test("an environment's live agent, each worker and the lead's subagents are one grid, each with its model", () => {
    store.rows = {
        subagents: [
            {
                table: "subagents",
                id: 9,
                dispatcher: "s1",
                task: "Look around",
                agent_type: "Explore",
                model: "claude-haiku-5-5",
                session: "sub-1",
                state: "running",
                started_at: 5,
                ended_at: 0,
                resumed_at: 0,
            },
        ],
    };
    const lead = {id: 1, session: "s1", model: "claude-sonnet-5-5", doing: "reading a file", heard_at: at(10), status: "working"};
    const summary = {
        environments: [
            {
                environment: {id: 1, name: "main"},
                agent: lead,
                task: {id: 4, title: "Port the viewer"},
                questions: 0,
                messages: 0,
                tasks: 1,
                silent: false,
            },
        ],
    };
    const workers = [
        {id: 3, name: "Hedy", brief: "Fix the tunnel", model: "claude-opus-5-5", state: "dispatched", created_at: at(1), updated_at: at(2)},
    ];
    const cells = orchestraOf(summary, workers, lead, "main");
    expect(cells.map((c) => [c.kind, c.title, c.model])).toEqual([
        ["environment", "Port the viewer", "claude-sonnet-5-5"],
        ["worker", "Fix the tunnel", "claude-opus-5-5"],
        ["subagent", "Look around", "claude-haiku-5-5"],
    ]);
    expect(cells.map((c) => c.opens)).toEqual([
        {table: "agents", id: 1},
        {table: "workers", id: 3},
        {table: "agents", id: 1, session: "sub-1"},
    ]);
});

test("a cell shows what the agent said and the plain line of what it does, never a tool name", () => {
    const lead = {
        id: 1,
        session: "s1",
        tool: "Bash",
        last_message: "The cover now keeps its version.",
        doing: "Reading orchestra.js",
        heard_at: at(10),
        status: "working",
    };
    const summary = {
        environments: [{environment: {id: 1, name: "main"}, agent: lead, task: null, questions: 0, messages: 0, tasks: 0, silent: false}],
    };
    store.rows = {messages: []};
    const [shown] = orchestraOf(summary, [], null, "main");
    expect([shown.says, shown.doing, JSON.stringify(shown)]).toEqual([
        "The cover now keeps its version.",
        "Reading orchestra.js",
        expect.not.stringContaining("Bash"),
    ]);
});

test("working agents are drawn first whatever the order, then those waiting, then the idle and the stopped", async () => {
    const {ordered} = await import("../src/domain/orchestra.js");
    const entry = (key, n, state, time = 0) => ({key, n, kind: "worker", time, card: {state}});
    const grid = [entry("worker:1", 1, "stopped"), entry("worker:2", 2, "idle"), entry("worker:3", 3, "working"), entry("worker:4", 4, "waiting")];
    expect(ordered(grid, "number", grid.map((e) => e.key)).map((e) => e.n)).toEqual([3, 4, 2, 1]);
    expect(ordered(grid, "active").map((e) => e.n)).toEqual([3, 4, 2, 1]);
});
