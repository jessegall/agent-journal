import {createApp, h} from "vue";
import {afterEach, describe, expect, test} from "vitest";
import {flush} from "./flush.js";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

const {store} = await import("../src/state/store.js");
const {subagentsOf} = await import("../src/domain/subagents.js");
const {default: CrewList} = await import("../src/chat/CrewList.vue");

const now = Date.now() / 1000;
const HOUR = 3600;
const row = (id, task, more = {}) => ({
    table: "subagents",
    id,
    dispatcher: "s1",
    task,
    agent_type: "journal-researcher",
    model: "sonnet",
    session: `a${id}`,
    state: "done",
    started_at: now - 5 * HOUR,
    ended_at: now - 4 * HOUR,
    resumed_at: 0,
    ...more,
});
let app = null;

afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
});

describe("the subagents of an agent", () => {
    test("are read from their rows: a background one and a resumed one run until they stop, and another agent's are left out", () => {
        store.rows = {
            subagents: [
                row(1, "map the hooks", {state: "running", ended_at: 0}),
                row(2, "judge the replays", {state: "running", ended_at: 0, resumed_at: now - 60}),
                row(3, "read the parser"),
                row(4, "another agent's", {dispatcher: "s2", state: "running"}),
            ],
        };
        const subs = subagentsOf({id: 1, session: "s1"});
        expect(subs.map((s) => [s.task, s.running])).toEqual([
            ["map the hooks", true],
            ["judge the replays", true],
            ["read the parser", false],
        ]);
        expect(subs[1].time).toBe(now - 60);
        expect(subagentsOf(null)).toEqual([]);
    });

    test("the dropdown never hides a running one and lists the earlier ones on a click", async () => {
        store.settings = {agent_sessions: {recent: 60}};
        const rows = [
            {id: "subagents:1", task: "map the hooks", running: true, time: now - 5 * HOUR, ended: 0, session: "a1"},
            {
                id: "subagents:2",
                task: "read the parser",
                running: false,
                status: "done",
                time: now - 5 * HOUR,
                ended: now - 4 * HOUR,
                session: "a2",
            },
            {
                id: "subagents:3",
                task: "read the router",
                running: false,
                status: "done",
                time: now - 5 * HOUR,
                ended: now - 4 * HOUR,
                session: "a3",
            },
        ];
        const host = document.createElement("div");
        document.body.append(host);
        app = createApp({render: () => h(CrewList, {rows, started: "dispatched", heading: "Subagents"})});
        app.mount(host);
        await flush();
        const tasks = () => [...host.querySelectorAll(".crew-row .crew-what")].map((r) => r.textContent.trim());
        expect(tasks()).toEqual([expect.stringContaining("map the hooks")]);
        expect(host.querySelector(".crew-none").textContent).toBe("1 running, 3 dispatched in this session.");
        const earlier = host.querySelector(".crew-earlier");
        expect(earlier.textContent).toBe("Show 2 earlier");
        earlier.click();
        await flush();
        expect(tasks()).toHaveLength(3);
        expect(host.querySelector(".crew-earlier")).toBeNull();
    });
});
