import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {flush} from "./flush.js";
import {workerActions, workerState} from "../src/domain/workers.js";
import {pointRows} from "../src/domain/workerShift.js";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

const {default: WorkerShift} = await import("../src/resource/WorkerShift.vue");

let app = null;

afterEach(() => {
    app?.unmount();
    document.body.innerHTML = "";
});

const worker = (state) => ({
    id: 3,
    state,
    task: {
        task_id: 7,
        points: ["reads the grammar", "names each rule", "passes its test"],
        todos: [{text: "write the grammar", complete: true}, {text: "run it", complete: false}],
        proofs: [{point: 1, text: "parser.py:12", state: "checked", shortfall: ""}, {point: 2, text: "parser.py:30", state: "shown", shortfall: ""}],
    },
});

test("a worker's task reads as its points, each with its latest proof or none", () => {
    expect(pointRows(worker("clocked out").task).map((row) => [row.point, row.wording, row.proof?.state || null])).toEqual([
        [1, "reads the grammar", "checked"],
        [2, "names each rule", "shown"],
        [3, "passes its test", null],
    ]);
});

test("the worker's states read as the page draws them, a clocked-out worker offering its merge", () => {
    expect(["clocked in", "clocked out", "ended without clocking out", "merged", "released"].map((state) => workerState({state}))).toEqual(["running", "ready", "unfinished", "finished", "finished"]);
    expect(workerActions({state: "clocked out"}).map((action) => action.key)).toEqual(["merge"]);
    expect(workerActions({state: "ended without clocking out"}).map((action) => action.key)).toEqual(["send", "release"]);
});

test("a clocked-out worker's page offers check and send back on a proof not yet checked, and shows its to-do list", async () => {
    const api = {act: vi.fn(async () => ({}))};
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(WorkerShift, {worker: worker("clocked out"), api})});
    app.mount(host);
    await flush();
    const buttons = [...host.querySelectorAll("button")].map((button) => button.textContent.trim());
    expect(buttons).toEqual(["Check", "Send back"]);
    expect(host.textContent).toContain("Checked");
    expect(host.textContent).toContain("No proof yet");
    expect(host.textContent).toContain("write the grammar");
    host.querySelector("button").click();
    await flush();
    expect(api.act).toHaveBeenCalledWith("workers", 3, "check", {point: 2});
});

test("a worker still at work has no check to offer", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(WorkerShift, {worker: worker("clocked in"), api: {act: vi.fn()}})});
    app.mount(host);
    await flush();
    expect(host.querySelectorAll("button").length).toBe(0);
});
