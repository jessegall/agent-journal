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

test("the test queue lists what waits and what ran lately, each with its worker, task, state and output", async () => {
    await panel(async (line) => answers[line.join(" ")] ?? {ok: true, value: {rows: []}});
    const rows = (kind) => [...document.body.querySelectorAll(`[data-queue-row=${kind}]`)].map((row) => row.textContent.replace(/\s+/g, " ").trim());
    expect(rows("queued")).toEqual(["Worker 21 Task 11 running Output 70 pytest tests/cart", "Worker 22 Task 12 queued pytest tests/tax"]);
    expect(rows("recent")).toEqual(["Worker 21 Task 9 checked Output 66 pytest tests/old", "Worker 22 Task 8 short Output 60 pytest tests/older"]);
});

test("an empty queue says no test waits", async () => {
    await panel(async () => ({ok: true, value: {rows: []}}));
    expect(document.body.querySelector("[data-queue-empty]").textContent).toBe("No test waits.");
});
