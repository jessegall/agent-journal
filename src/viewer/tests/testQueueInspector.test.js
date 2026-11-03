import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import ResourcePanel from "../src/resource/ResourcePanel.vue";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

const later = () => new Promise((resolve) => setTimeout(resolve, 30));
const PROOFS = [
    {id: 1, task_id: 11, worktree_id: 3, state: "running", test_command: "pytest tests/cart", process_id: 70, updated_at: "2026-11-03T00:03:00Z"},
    {id: 2, task_id: 12, worktree_id: 4, state: "queued", test_command: "pytest tests/tax", process_id: null, updated_at: "2026-11-03T00:02:00Z"},
    {id: 3, task_id: 9, worktree_id: 3, state: "checked", test_command: "pytest tests/old", process_id: 66, updated_at: "2026-11-03T00:01:00Z"},
    {id: 4, task_id: 8, worktree_id: 4, state: "short", test_command: "pytest tests/older", process_id: 60, updated_at: "2026-11-03T00:00:00Z"},
    {id: 5, task_id: 7, worktree_id: 4, state: "shown", test_command: "", process_id: null, updated_at: "2026-11-02T23:00:00Z"},
];
const WORKTREES = [{id: 3, agent_id: 21}, {id: 4, agent_id: 22}];
const answers = {"proof list --limit 50": {ok: true, value: {rows: PROOFS}}, "worker-worktree list": {ok: true, value: {rows: WORKTREES}}};
let app = null;

async function panel(read) {
    location.hash = "#/?open=test_queue:0";
    await later();
    const element = document.createElement("div");
    document.body.append(element);
    app = createApp({render: () => h(ResourcePanel, {read})});
    app.mount(element);
    await later();
    await settle();
}

afterEach(async () => {
    app?.unmount();
    app = null;
    location.hash = "";
    await later();
});

test("the waiting status of an agent opens the test queue", async () => {
    const worker = {id: 21, session: "s-w", program: "claude", role: "worker", ended_at: null};
    const facts = [{id: 21, model: "sonnet", tasks: [{id: 11, title: "Fix", state: "testing"}], state: "", profile: "", given_name: ""}];
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context({"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page(facts)}));
    document.body.append(element);
    element.querySelector("[data-agent-waiting]").click();
    await settle();
    expect(location.hash).toContain("open=test_queue:0");
    expect(element.querySelector("[data-agent-more]")).toBeNull();
});

const OUTPUT_LINES = ["collected 3 items", "tests/cart passed"];
const reader = async (line) => answers[line.join(" ")] ?? (line[0] === "output" ? {ok: true, value: {lines: OUTPUT_LINES}} : {ok: true, value: {rows: []}});
const rowsOf = (kind) => [...document.body.querySelectorAll(`[data-queue-row=${kind}]`)];
const states = (kind) => rowsOf(kind).map((row) => row.querySelector("[data-queue-state]").textContent.trim());

test("the test queue lists what waits and what ran lately, each with its worker, task and command", async () => {
    await panel(reader);
    const parts = (row) => [...row.querySelectorAll("[data-queue-worker], [data-queue-task], .command")].map((part) => part.textContent.trim());
    expect(rowsOf("queued").map(parts)).toEqual([["Worker 21", "Task 11", "pytest tests/cart"], ["Worker 22", "Task 12", "pytest tests/tax"]]);
    expect(rowsOf("recent").map(parts)).toEqual([["Worker 21", "Task 9", "pytest tests/old"], ["Worker 22", "Task 8", "pytest tests/older"]]);
});

test("a row says Waiting, Running, Passed or Failed, and a passed proof never reads as checked", async () => {
    await panel(reader);
    expect(states("queued")).toEqual(["Running", "Waiting"]);
    expect(states("recent")).toEqual(["Passed", "Failed"]);
    expect(document.body.querySelector("[data-test-queue]").textContent).not.toMatch(/checked|queued|short/i);
});

test("the headings are Queue and Recent", async () => {
    await panel(reader);
    const heading = (kind) => document.body.querySelector(`[data-queue-heading=${kind}]`).textContent.replace(/\d+$/, "").trim();
    expect(heading("queued")).toBe("Queue");
    expect(heading("recent")).toBe("Recent");
});

test("a row's output opens in place under it and collapses again", async () => {
    await panel(reader);
    const row = rowsOf("recent")[0];
    expect(row.querySelector("[data-queue-output-body]")).toBeNull();
    row.querySelector("[data-queue-output]").click();
    await settle();
    expect(row.querySelector("[data-queue-output-body]").textContent).toBe(OUTPUT_LINES.join("\n"));
    expect(row.querySelector("[data-queue-output]").getAttribute("aria-expanded")).toBe("true");
    row.querySelector("[data-queue-output]").click();
    await settle();
    expect(row.querySelector("[data-queue-output-body]")).toBeNull();
    expect(row.querySelector("[data-queue-output]").getAttribute("aria-expanded")).toBe("false");
});

test("a row whose test has not run has no output to open", async () => {
    await panel(reader);
    expect(rowsOf("queued")[1].querySelector("[data-queue-output]")).toBeNull();
});

test("an empty queue says no test waits", async () => {
    await panel(async () => ({ok: true, value: {rows: []}}));
    expect(document.body.querySelector("[data-queue-empty]").textContent).toBe("No test waits.");
});
