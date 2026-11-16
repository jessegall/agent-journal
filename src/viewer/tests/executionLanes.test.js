import {afterEach, expect, test} from "vitest";
import {createApp, h, nextTick} from "vue";
import ExecutionLanes from "../src/resource/ExecutionLanes.vue";

const ENTRY = {class: "test, build or check", priority: "agent", starter: "worker 3", reason: "", raised_from: "", parent_line: ""};
const EXECUTION = {
    lanes: [
        {lane: "instant", used: 1, capacity: 24, over_capacity: false, halted: false, halt_type: "", halt_reason: "",
         running: [{...ENTRY, line: "PreToolUse", class: "agent hook", priority: "reserved", seconds: 0, slot_cost: 1, kind: "agent hook", run_id: 0}], waiting: []},
        {lane: "short", used: 0, capacity: 12, over_capacity: false, halted: false, halt_type: "", halt_reason: "", running: [], waiting: []},
        {lane: "long", used: 4, capacity: 8, over_capacity: false, halted: true, halt_type: "command", halt_reason: "Machine maintenance",
         running: [
             {...ENTRY, line: "make build", seconds: 40, slot_cost: 4, kind: "build", run_id: 70},
             {...ENTRY, line: "journal-run watch", class: "background job", seconds: 900, slot_cost: 0, kind: "background job", run_id: 71},
         ],
         waiting: [
             {...ENTRY, line: "pytest", priority: "reserved", starter: "worker 4", seconds: 90, slot_cost: 4, kind: "test run", run_id: 72, reason: "the long lane is paused", raised_from: "agent"},
             {...ENTRY, line: "make check", seconds: 30, slot_cost: 4, kind: "check", run_id: 73, reason: "waits for a reader"},
         ]},
    ],
    waits: [{priority: "agent", runs: 3, longest_seconds: 40, average_seconds: 13}, {priority: "normal", runs: 0, longest_seconds: 0, average_seconds: 0}],
};
let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
});

function mounted(execution = EXECUTION, listeners = {}) {
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(ExecutionLanes, {execution, environment: "main", pausable: true, ...listeners})});
    app.mount(host);
    return host;
}

const lane = (view, name) => view.querySelector(`[data-lane="${name}"]`);

test("a paused long lane shows its use, Paused, its reason, Resume, and a strip with each run in the cells it takes", () => {
    const long = lane(mounted(), "long");
    expect(long.querySelector("h3").textContent).toContain("Long lane");
    expect(long.querySelector("[data-lane-use]").textContent).toBe("4 of 8 slots · 2 waiting");
    expect(long.querySelector("[data-lane-state]").textContent).toBe("Paused");
    expect(long.querySelector("[data-lane-note]").textContent).toContain("Paused · Machine maintenance. No waiting run starts here until it is resumed");
    expect(long.querySelector("[data-lane-resume]")).not.toBeNull();
    expect(long.querySelector("[data-lane-pause]")).toBeNull();
    expect(long.textContent).toContain("A test, a build or a check takes 4 slots, an install 2.");
    const cells = [...long.querySelectorAll("[data-lane-cell]")];
    expect(cells.map((cell) => cell.dataset.laneCell)).toEqual(["run", "free", "free", "free", "free"]);
    expect(cells[0].style.flex).toMatch(/^4/);
    expect(cells[0].textContent).toBe("build");
});

test("running rows say their kind, what they take and who started them; waiting rows are numbered with the reason said once", () => {
    const long = lane(mounted(), "long");
    const running = [...long.querySelectorAll('[data-lane-entry="running"]')];
    expect(running.map((row) => row.querySelector("[data-lane-kind]").textContent)).toEqual(["build", "job"]);
    expect(running.map((row) => row.querySelector("[data-lane-takes]").textContent)).toEqual(["4 slots", "no slot"]);
    const waiting = [...long.querySelectorAll('[data-lane-entry="waiting"]')];
    expect(waiting.map((row) => row.querySelector("[data-lane-position]").textContent)).toEqual(["1", "2"]);
    expect(waiting[0].textContent).toContain("moved up");
    expect(waiting[1].textContent).toContain("reader");
    expect(long.querySelector("[data-lane-why]").textContent).toBe("Paused");
});

test("a row folds open to its facts and a link to its output", async () => {
    const long = lane(mounted(), "long");
    long.querySelector('[data-lane-entry="waiting"] button').click();
    await nextTick();
    const facts = long.querySelector("[data-lane-facts]").textContent;
    expect(facts).toContain("Place1 of 2 in the long lane");
    expect(facts).toContain("Why it waitsThe lane is paused");
    expect(facts).toContain("moved up from agent after a long wait");
    expect(long.querySelector("[data-lane-output]").getAttribute("href")).toBe("?page=processes.output&output=72&environment=main");
});

test("an empty lane is one line, and an open lane says No room in its waiting head", () => {
    const view = mounted();
    expect(lane(view, "short").querySelector("[data-lane-empty]").textContent).toBe("Nothing runs or waits here");
    const open = {...EXECUTION, lanes: [{...EXECUTION.lanes[2], halted: false, halt_type: "", halt_reason: "", used: 8}]};
    app.unmount();
    host.remove();
    const long = lane(mounted(open), "long");
    expect(long.querySelector("[data-lane-why]").textContent).toBe("No room: 8 of 8 slots in use");
    expect(long.querySelector("[data-lane-pause]")).not.toBeNull();
    expect(long.querySelector("[data-lane-note]")).toBeNull();
});

test("a lane over its limit says how far and draws the run that crosses it red", () => {
    const over = {...EXECUTION, lanes: [{...EXECUTION.lanes[2], halted: false, halt_type: "", capacity: 2, used: 4, over_capacity: true}]};
    const long = lane(mounted(over), "long");
    expect(long.querySelector("[data-lane-state]").textContent).toBe("2 over");
    expect(long.querySelector('[data-lane-cell="run"]').classList.contains("over")).toBe(true);
});

test("a lane held for an update says so and offers no Resume", () => {
    const held = {...EXECUTION, lanes: [{...EXECUTION.lanes[2], halt_type: "update", halt_reason: "An update waits for the running commands to end"}]};
    const long = lane(mounted(held), "long");
    expect(long.querySelector("[data-lane-state]").textContent).toBe("Held");
    expect(long.querySelector("[data-lane-note]").textContent).toContain("Update: waiting. The update waits for the running commands to end. Nothing new starts here until it is done; the 2 waiting keep their place.");
    expect(long.querySelector("[data-lane-resume]")).toBeNull();
});

test("Pause asks for a reason and sends it; Resume sends resume", async () => {
    const asked = [];
    const open = {...EXECUTION, lanes: [{...EXECUTION.lanes[2], halted: false, halt_type: "", halt_reason: ""}]};
    const view = mounted(open, {onPause: (reason) => asked.push(["pause", reason]), onResume: () => asked.push(["resume"])});
    view.querySelector("[data-lane-pause]").click();
    await nextTick();
    const input = view.querySelector("[data-lane-pause-form] input");
    input.value = "Machine maintenance";
    input.dispatchEvent(new Event("input"));
    view.querySelector("[data-lane-pause-form]").dispatchEvent(new Event("submit"));
    await nextTick();
    expect(asked).toEqual([["pause", "Machine maintenance"]]);
    app.unmount();
    host.remove();
    mounted(EXECUTION, {onResume: () => asked.push(["resume"])}).querySelector("[data-lane-resume]").click();
    expect(asked).toEqual([["pause", "Machine maintenance"], ["resume"]]);
});

test("the starter filter hides rows only and says how many it shows; the waits are a table", async () => {
    const view = mounted();
    const select = view.querySelector("[data-lanes-starter]");
    select.value = "worker 4";
    select.dispatchEvent(new Event("change"));
    await nextTick();
    expect(view.querySelectorAll('[data-lane-entry="running"]').length).toBe(0);
    expect(view.querySelectorAll('[data-lane-entry="waiting"]').length).toBe(1);
    expect(view.querySelector("[data-lanes-count]").textContent).toBe("3 running · 2 waiting · showing 1 of 5");
    expect(lane(view, "long").querySelector("[data-lane-use]").textContent).toBe("4 of 8 slots · 2 waiting");
    expect([...view.querySelectorAll("[data-lanes-waits] td")].map((cell) => cell.textContent)).toEqual(["agent", "3", "40s", "13s"]);
});
