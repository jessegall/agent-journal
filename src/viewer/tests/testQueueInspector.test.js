import {createApp, h} from "vue";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test, vi} from "vitest";
import ProcessQueueBody from "../src/resource/ProcessQueueBody.vue";
import {RESOURCE_SUBSCRIPTIONS} from "../src/resource/resourceEvents.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {context, mounted, page, settle} from "./support/codingWindowContext.js";

vi.stubGlobal("matchMedia", () => ({matches: true}));
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
    owner_agent_id: 21,
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
    environment_name: "main",
    parallel_limit: 2,
    limit_setting: "journal.core.processes.run-batch-size",
    used_slots: 1,
    waiting_count: 2,
    halted: false,
    halt_cause: "",
    halt_reason: "",
    running: [RUN],
    waiting: [
        {
            ...RUN,
            id: 71,
            task_id: 12,
            owner_agent_id: 22,
            section: "waiting",
            line: "make checks",
            category: "check",
            started_at: null,
            uses_slot: false,
        },
        {...RUN, id: 72, task_id: 13, owner_agent_id: 23, section: "waiting", line: "make site", started_at: null, uses_slot: false},
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
const OUTPUT_LINES = ["compiling package", "linking package"];
const reader = async (line) => (line[0] === "output" ? {ok: true, value: {lines: OUTPUT_LINES, first_byte: 0, last_byte: 20, total: 20, cut_bytes: 0}} : {ok: true, value: SNAPSHOT});
const rowsOf = (section) => [...document.body.querySelectorAll(`[data-queue-row="${section}"]`)];
let app = null;
let subscriptions = null;

async function panel(read, agent = 0) {
    const element = document.createElement("div");
    document.body.append(element);
    app = createApp({render: () => h(ProcessQueueBody, {read, agent})});
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
    document.body.innerHTML = "";
    location.hash = "";
    await later();
});

test("queue arrivals and departures keep their Vue transition classes", async () => {
    const frame = vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 0);
    try {
        let queue = SNAPSHOT;
        await panel(async () => ({ok: true, value: queue}));
        queue = {...SNAPSHOT, running: [RUN, {...SNAPSHOT.waiting[0], section: "running"}], waiting: []};
        subscriptions.dispatch({event: "process.update", row_id: 71});
        await settle();
        expect(document.querySelector('[data-queue-process="71"]').dataset.queueRow).toBe("running");
        expect(document.querySelector('[data-queue-process="72"]').classList.contains("queue-leave-active")).toBe(true);
    } finally {
        frame.mockRestore();
    }
});

test("queue motion styles include reordering and respect reduced motion", () => {
    const inspector = readFileSync(resolve(__dirname, "../src/resource/ProcessQueueBody.vue"), "utf8");
    const run = readFileSync(resolve(__dirname, "../src/resource/ProcessQueueRun.vue"), "utf8");
    expect(inspector).toContain('<TransitionGroup name="queue"');
    expect(inspector).toContain(".queue-move");
    expect(inspector).toContain(".queue-leave-active { position: absolute;");
    expect(inspector).toMatch(/prefers-reduced-motion: reduce[\s\S]*transition: none/);
    expect(run).toMatch(/prefers-reduced-motion: reduce[\s\S]*transition:\s*none/);
});

test("the process queue reads its counts and ordered lists together", async () => {
    const read = vi.fn(reader);
    await panel(read);
    expect(read).toHaveBeenCalledExactlyOnceWith(["queue", "list"]);
    expect(document.body.querySelector("[data-queue-spots]").textContent).toBe("1 of 2");
    expect(document.body.querySelector("[data-queue-waiting]").textContent).toBe("2");
    expect([...document.body.querySelectorAll("[data-queue-heading]")].map((item) => item.textContent)).toEqual([
        "Running1",
        "Waiting2",
        "Finished1",
    ]);
    expect([...document.body.querySelectorAll("[data-queue-heading]")].every((item) => item.classList.contains("sticky-band"))).toBe(true);
    expect(rowsOf("running")[0].textContent).toContain("make package");
    expect(rowsOf("running")[0].textContent).toContain("Agent 21");
    expect(rowsOf("running")[0].textContent).toContain("Task 11");
    expect(rowsOf("running")[0].querySelector("[data-queue-type]").textContent).toBe("Build");
    expect(rowsOf("waiting").map((row) => row.querySelector(".command").textContent)).toEqual(["make checks", "make site"]);
    expect(rowsOf("waiting").map((row) => row.querySelector("[data-queue-position]").textContent)).toEqual(["1", "2"]);
    expect(rowsOf("recent")[0].querySelector("[data-queue-time]").textContent).toBe("1 m 5 s");
    expect(rowsOf("recent")[0].querySelector(".dot").title).toBe("Passed");
});

test("a plugin's run shows under the plugin's name", async () => {
    const plugin_run = {...RUN, id: 74, category: "unknown", plugin: "judge", owner_agent_id: null, task_id: null, line: "sh ./check.sh"};
    await panel(async () => ({ok: true, value: {...SNAPSHOT, running: [plugin_run]}}));
    expect(rowsOf("running")[0].querySelector("[data-queue-type]").textContent).toBe("Plugin judge");
});

test("Show older commands reads more of the Finished list, and shows only while there are older ones", async () => {
    let total = 30;
    const read = vi.fn(async () => ({ok: true, value: {...SNAPSHOT, recent_total: total}}));
    await panel(read);
    total = 1;
    document.body.querySelector("[data-queue-older]").click();
    await settle();
    expect(read).toHaveBeenLastCalledWith(["queue", "list", "--recent", "40"]);
    expect(document.body.querySelector("[data-queue-older]")).toBeNull();
});

test("output opens under a process and collapses again", async () => {
    const read = vi.fn(reader);
    await panel(read);
    const row = rowsOf("recent")[0];
    row.querySelector(".toggle").click();
    await settle();
    expect(row.querySelector("[data-queue-output-body]").textContent).toContain(OUTPUT_LINES.join("\n"));
    expect(row.querySelector(".toggle").getAttribute("aria-expanded")).toBe("true");
    expect(read).toHaveBeenCalledWith(["output", "page", "66", "--limit", "50"]);
    expect(row.querySelector('a[target="_blank"]').getAttribute("href")).toContain("page=processes.output&output=66");
    row.querySelector(".toggle").click();
    await settle();
    expect(row.querySelector(".drop").classList.contains("open")).toBe(false);
});

test("a limit a suite names shows beside the commands at once and saves its setting", async () => {
    const limit = {key: "journal.suites.coding.workers.worker-run-most-tests", title: "Test limit per worker command", description: "Stop worker commands above this test count.", value: 0};
    const read = vi.fn(async () => ({ok: true, value: {...SNAPSHOT, suite_limits: [limit]}}));
    await panel(read);
    const input = document.body.querySelector("[data-queue-suite-limit]");
    expect(document.body.textContent).toContain("Test limit per worker command");
    input.value = "500";
    input.dispatchEvent(new Event("change"));
    await settle();
    expect(read).toHaveBeenCalledWith(["setting", "set", limit.key, "500"]);
});

test("the stepper saves its declared setting and refreshes the queue", async () => {
    let queue = {...SNAPSHOT};
    const read = vi.fn(async (line) => {
        if (line[0] === "setting") {
            queue = {...queue, parallel_limit: Number(line[3])};
        }
        return {ok: true, value: queue};
    });
    await panel(read);
    document.body.querySelector('[aria-label="One more command at once"]').click();
    await settle();
    expect(read).toHaveBeenCalledWith(["setting", "set", SNAPSHOT.limit_setting, "3"]);
    expect(document.body.querySelector("[data-queue-limit]").textContent).toBe("3");
    document.body.querySelector('[aria-label="One fewer command at once"]').click();
    await settle();
    expect(document.body.querySelector("[data-queue-limit]").textContent).toBe("2");
});

test("the minimum limit disables decrease and a refused setting stays unchanged", async () => {
    await panel(async (line) =>
        line[0] === "setting" ? {ok: false, error: "Read only"} : {ok: true, value: {...SNAPSHOT, parallel_limit: 1}}
    );
    expect(document.body.querySelector('[aria-label="One fewer command at once"]').disabled).toBe(true);
    document.body.querySelector('[aria-label="One more command at once"]').click();
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
    expect(document.body.querySelector("[data-queue-held]").textContent).toContain("Machine maintenance");
    expect(document.body.querySelector('[data-queue-empty="waiting"]').textContent).toBe("Nothing waits. A command that starts now gets a place at once.");
    expect(document.body.textContent).not.toContain("Process queue");
});

test("a queue held by an update says the update waits for the running commands and the others keep their order", async () => {
    await panel(async () => ({
        ok: true,
        value: {...SNAPSHOT, halted: true, halt_cause: "update", halt_reason: "An update waits for the running commands to end"},
    }));
    const note = document.body.querySelector("[data-queue-update-waits]").textContent;
    expect(note).toContain("An update waits for the running commands to end.");
    expect(note).toContain("gets its place once the update is done");
    expect(document.body.querySelector("[data-queue-held]")).toBeNull();
});

test("a failed queue read shows its error", async () => {
    await panel(async () => ({ok: false, error: "Queue unavailable"}));
    expect(document.body.querySelector('[role="alert"]').textContent).toBe("Queue unavailable");
});

test("process events refresh the queue and output events refresh only an open output", async () => {
    let queue = SNAPSHOT;
    let output = ["building package"];
    const read = vi.fn(async (line) => line[0] === "output" ? {ok: true, value: {lines: output, first_byte: 0, last_byte: 20, total: 20, cut_bytes: 0}} : {ok: true, value: queue});
    await panel(read);
    subscriptions.dispatch({event: "task.update", row_id: 11});
    await settle();
    expect(read).toHaveBeenCalledTimes(1);
    queue = {...SNAPSHOT, waiting: [], waiting_count: 0};
    subscriptions.dispatch({event: "process.update", row_id: 71});
    await settle();
    expect(read).toHaveBeenCalledTimes(2);
    await vi.waitFor(() => expect(rowsOf("waiting")).toHaveLength(0));
    const row = rowsOf("running")[0];
    subscriptions.dispatch({event: "output.update", row_id: 70});
    await settle();
    expect(read.mock.calls.filter(([line]) => line[0] === "output")).toHaveLength(0);
    await new Promise((resolve) => setTimeout(resolve, 150));
    row.querySelector(".toggle").click();
    await settle();
    output = ["package built"];
    subscriptions.dispatch({event: "output.update", row_id: 70});
    await settle();
    expect(row.querySelector("[data-queue-output-body]").textContent).toContain("package built");
    expect(read.mock.calls.filter(([line]) => line[0] === "output")).toHaveLength(2);
    row.querySelector(".toggle").click();
    await settle();
    await new Promise((resolve) => setTimeout(resolve, 150));
    subscriptions.dispatch({event: "output.update", row_id: 70});
    await settle();
    expect(read.mock.calls.filter(([line]) => line[0] === "output")).toHaveLength(2);
});

test("the queue window declares the output events it follows, so an open output keeps following its latest lines, and its inspector the process events", () => {
    const module = readFileSync(resolve(__dirname, "../../core/modules/processes/processes_module.py"), "utf8");
    const inspector = readFileSync(resolve(__dirname, "../../core/modules/processes/support/queue_inspector.py"), "utf8");
    expect(module).toMatch(/WindowDeclaration\("processes\.queue-body", "Process queue",[\s\S]*?events=\["output\.\*"\]\)/);
    expect(inspector).toContain('events=tuple(["process.*"])');
});

test("the queue is named Process queue in its window and its inspector, and its window may read the pages of an output it opens", () => {
    const module = readFileSync(resolve(__dirname, "../../core/modules/processes/processes_module.py"), "utf8");
    const inspector = readFileSync(resolve(__dirname, "../../core/modules/processes/support/queue_inspector.py"), "utf8");
    expect(module).toMatch(/WindowDeclaration\("processes\.queue-body", "Process queue",[\s\S]*?reads=\["queue list", "output page"\]/);
    expect(inspector).toContain('label="Process queue"');
    expect(`${module}${inspector}`).not.toContain("Test queue");
});

test("an agent's Processes tab reads only that agent's runs and shows no queue controls", async () => {
    const asked = [];
    await panel(async (line) => (asked.push(line), reader(line)), 41);
    expect(asked[0]).toEqual(["queue", "list", "--agent", "row:41"]);
    expect(rowsOf("running")).toHaveLength(1);
    expect(rowsOf("waiting")).toHaveLength(2);
    expect(rowsOf("recent")).toHaveLength(1);
    expect(document.body.querySelector(".lead")).toBeNull();
});
