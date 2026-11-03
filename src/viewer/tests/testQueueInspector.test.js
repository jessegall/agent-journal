import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import ResourcePanel from "../src/resource/ResourcePanel.vue";
import {RESOURCE_SUBSCRIPTIONS} from "../src/resource/resourceEvents.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";

vi.stubGlobal(
    "ResizeObserver",
    class {
        observe() {}

        disconnect() {}
    }
);

const later = () => new Promise((resolve) => setTimeout(resolve, 30));
const RUN = {
    id: 70,
    task_id: 11,
    worker_id: 21,
    category: "build",
    line: "make package",
    state: "running",
    section: "running",
    created_at: "2026-11-03T10:00:00Z",
    started_at: "2026-11-03T10:00:05Z",
    ended_at: null,
    uses_slot: true,
};
const SNAPSHOT = {
    environment_id: 1,
    parallel_limit: 2,
    limit_setting: "journal.core.processes.run-batch-size",
    count_main_runs: false,
    main_spots_setting: "journal.core.processes.main-runs-take-slots",
    used_slots: 1,
    waiting_count: 2,
    halted: false,
    halt_reason: "",
    running: [RUN],
    waiting: [
        {
            ...RUN,
            id: 71,
            task_id: 12,
            worker_id: 22,
            section: "waiting",
            line: "make checks",
            category: "check",
            started_at: null,
            uses_slot: false,
        },
        {...RUN, id: 72, task_id: 13, worker_id: 23, section: "waiting", line: "make site", started_at: null, uses_slot: false},
    ],
    recent: [
        {
            ...RUN,
            id: 66,
            task_id: 9,
            section: "recent",
            state: "finished",
            line: "make previous",
            ended_at: "2026-11-03T10:01:10Z",
            uses_slot: false,
        },
    ],
};
let app = null;
let subscriptions = null;

async function panel(read) {
    location.hash = "#/?open=test_queue:0";
    await later();
    const element = document.createElement("div");
    document.body.append(element);
    app = createApp({render: () => h(ResourcePanel, {read})});
    subscriptions = new WindowSubscriptions();
    app.provide(RESOURCE_SUBSCRIPTIONS, subscriptions);
    app.mount(element);
    await later();
    await settle();
}

afterEach(async () => {
    app?.unmount();
    expect(subscriptions?.count("resources") ?? 0).toBe(0);
    subscriptions = null;
    app = null;
    location.hash = "";
    await later();
});

test("the waiting status of an agent opens the test queue", async () => {
    const worker = {id: 21, session: "s-w", program: "claude", role: "worker", ended_at: null};
    const facts = [{id: 21, model: "sonnet", tasks: [{id: 11, title: "Fix", state: "testing"}], state: "", profile: "", given_name: ""}];
    const element = await mounted(
        {render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})},
        context({"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page(facts)})
    );
    document.body.append(element);
    element.querySelector("[data-agent-waiting]").click();
    await settle();
    expect(location.hash).toContain("open=test_queue:0");
    expect(element.querySelector("[data-agent-more]")).toBeNull();
});

const OUTPUT_LINES = ["building package", "package built"];
const rowsOf = (kind) => [...document.body.querySelectorAll(`[data-queue-row=${kind}]`)];
const reader = async (line) => (line[0] === "output" ? {ok: true, value: {lines: OUTPUT_LINES}} : {ok: true, value: SNAPSHOT});

test("the process queue reads its counts and ordered lists together", async () => {
    const read = vi.fn(reader);
    await panel(read);
    expect(read).toHaveBeenCalledExactlyOnceWith(["queue", "list"]);
    expect(document.body.querySelector("[data-resource-panel]").classList.contains("queue")).toBe(true);
    expect(document.body.querySelector("[data-queue-spots]").textContent).toBe("1 / 2");
    expect(document.body.querySelector("[data-queue-waiting]").textContent).toBe("2");
    expect([...document.body.querySelectorAll("[data-queue-heading]")].map((item) => item.textContent)).toEqual([
        "Running 1",
        "Waiting 2",
        "Finished lately 1",
    ]);
    expect(rowsOf("running")[0].textContent).toContain("make package");
    expect(rowsOf("running")[0].textContent).toContain("Worker 21");
    expect(rowsOf("running")[0].textContent).toContain("Task 11");
    expect(rowsOf("running")[0].querySelector("[data-queue-kind]").textContent).toBe("build");
    expect(rowsOf("waiting").map((row) => row.querySelector(".command").textContent)).toEqual(["make checks", "make site"]);
    expect(rowsOf("waiting").map((row) => row.querySelector("[data-queue-position]").textContent)).toEqual(["1", "2"]);
    expect(rowsOf("recent")[0].querySelector("[data-queue-time]").textContent).toBe("1m 5s");
    expect(rowsOf("recent")[0].querySelector("[data-queue-state]").textContent).toBe("Passed");
});

test("output opens under a process and collapses again", async () => {
    await panel(reader);
    const row = rowsOf("recent")[0];
    row.querySelector("[data-queue-output]").click();
    await settle();
    expect(row.querySelector("[data-queue-output-body]").textContent).toBe(OUTPUT_LINES.join("\n"));
    expect(row.querySelector("[data-queue-output]").getAttribute("aria-expanded")).toBe("true");
    row.querySelector("[data-queue-output]").click();
    await settle();
    expect(row.querySelector("[data-queue-output-body]")).toBeNull();
});

test("the stepper and switch save their declared settings and refresh the queue", async () => {
    let queue = {...SNAPSHOT};
    const read = vi.fn(async (line) => {
        if (line[0] === "setting") {
            queue =
                line[2] === SNAPSHOT.limit_setting
                    ? {...queue, parallel_limit: Number(line[3])}
                    : {...queue, count_main_runs: line[3] === "on"};
        }
        return {ok: true, value: queue};
    });
    await panel(read);
    document.body.querySelector('[aria-label="More runs at once"]').click();
    await settle();
    expect(read).toHaveBeenCalledWith(["setting", "set", SNAPSHOT.limit_setting, "3"]);
    expect(document.body.querySelector("[data-queue-limit]").textContent).toBe("3");
    document.body.querySelector('[aria-label="Fewer runs at once"]').click();
    await settle();
    expect(document.body.querySelector("[data-queue-limit]").textContent).toBe("2");
    document.body.querySelector("[data-queue-main-spots]").click();
    await settle();
    expect(read).toHaveBeenCalledWith(["setting", "set", SNAPSHOT.main_spots_setting, "on"]);
    expect(document.body.querySelector("[data-queue-main-spots]").getAttribute("aria-checked")).toBe("true");
});

test("the minimum limit disables decrease and a refused setting stays unchanged", async () => {
    await panel(async (line) =>
        line[0] === "setting" ? {ok: false, error: "Read only"} : {ok: true, value: {...SNAPSHOT, parallel_limit: 1}}
    );
    expect(document.body.querySelector('[aria-label="Fewer runs at once"]').disabled).toBe(true);
    document.body.querySelector('[aria-label="More runs at once"]').click();
    await settle();
    expect(document.body.querySelector('[role="alert"]').textContent).toBe("Read only");
    expect(document.body.querySelector("[data-queue-limit]").textContent).toBe("1");
});

test("a held empty queue shows the reason and empty messages", async () => {
    await panel(async () => ({
        ok: true,
        value: {
            ...SNAPSHOT,
            running: [],
            waiting: [],
            recent: [],
            used_slots: 0,
            waiting_count: 0,
            halted: true,
            halt_reason: "Machine maintenance",
        },
    }));
    expect(document.body.querySelector("[data-queue-held]").textContent).toBe("Queue paused: Machine maintenance");
    expect(document.body.querySelector('[data-queue-empty="waiting"]').textContent).toBe("No command waits.");
    expect(document.body.textContent).toContain("Process queue");
    expect(document.body.textContent).not.toContain("Test queue");
});

test("a failed queue read shows its error", async () => {
    await panel(async () => ({ok: false, error: "Queue unavailable"}));
    expect(document.body.querySelector('[role="alert"]').textContent).toBe("Queue unavailable");
});

test("process events refresh the queue and output events refresh only an open output", async () => {
    let queue = SNAPSHOT;
    let output = ["building package"];
    const read = vi.fn(async (line) => line[0] === "output" ? {ok: true, value: {lines: output}} : {ok: true, value: queue});
    await panel(read);
    subscriptions.dispatch({event: "task.update", row_id: 11});
    await settle();
    expect(read).toHaveBeenCalledTimes(1);
    queue = {...SNAPSHOT, waiting: [], waiting_count: 0};
    subscriptions.dispatch({event: "process.update", row_id: 71});
    await settle();
    expect(read).toHaveBeenCalledTimes(2);
    expect(rowsOf("waiting")).toHaveLength(0);
    const row = rowsOf("running")[0];
    row.querySelector("[data-queue-output]").click();
    await settle();
    output = ["package built"];
    subscriptions.dispatch({event: "output.update", row_id: 70});
    await settle();
    expect(row.querySelector("[data-queue-output-body]").textContent).toBe("package built");
    expect(read.mock.calls.filter(([line]) => line[0] === "output")).toHaveLength(2);
});
