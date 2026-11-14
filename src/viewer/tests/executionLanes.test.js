import {afterEach, expect, test} from "vitest";
import {createApp, h, nextTick} from "vue";
import ExecutionLanes from "../src/resource/ExecutionLanes.vue";

const EXECUTION = {
    lanes: [
        {lane: "instant", used: 1, capacity: 24, over_capacity: false, halted: false, running: [{line: "PreToolUse", class: "agent hook", priority: "reserved", starter: "worker 3", seconds: 0, reason: "", raised_from: "", parent_line: ""}], waiting: []},
        {lane: "long", used: 8, capacity: 8, over_capacity: false, halted: true,
         running: [{line: "make build", class: "test, build or check", priority: "agent", starter: "worker 3", seconds: 40, reason: "", raised_from: "", parent_line: ""}],
         waiting: [{line: "pytest", class: "test, build or check", priority: "reserved", starter: "worker 4", seconds: 90, reason: "the long lane is halted", raised_from: "agent", parent_line: ""}]},
    ],
    waits: [{priority: "agent", runs: 3, longest_seconds: 40, average_seconds: 13}, {priority: "normal", runs: 0, longest_seconds: 0, average_seconds: 0}],
};
let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
});

function mounted() {
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(ExecutionLanes, {execution: EXECUTION})});
    app.mount(host);
    return host;
}

test("each lane shows its room in use, what runs and what waits with its reason and where it was raised from", () => {
    const view = mounted();
    expect(view.querySelector('[data-lane="long"] h2').textContent).toContain("8 of 8 in use, halted");
    expect(view.querySelector('[data-lane="long"] [data-lane-entry="waiting"]').textContent).toContain("waiting 2 min: the long lane is halted. Raised from agent");
    expect(view.querySelector("[data-lanes-waits]").textContent).toContain("agent: 3 started, longest wait 40 s, average 13 s");
});

test("the starter filter keeps only the runs and waits of that starter", async () => {
    const view = mounted();
    const select = view.querySelector("[data-lanes-starter]");
    select.value = "worker 4";
    select.dispatchEvent(new Event("change"));
    await nextTick();
    expect(view.querySelectorAll('[data-lane-entry="running"]').length).toBe(0);
    expect(view.querySelectorAll('[data-lane-entry="waiting"]').length).toBe(1);
});
