import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import WorkerRow from "../src/chat/WorkerRow.vue";
import {workerActions, workerCounts, workerEnding, workerFiles, workerReuses, workersBySection, workerTag} from "../src/domain/workers.js";

const at = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();
const worker = (id, state, more = {}) => ({id, name: `Worker ${id}`, brief: "a job", state, created_at: at(10), updated_at: at(5), ...more});

test("a worker's cell says how often it was reused, and nothing before its first reuse", () => {
    expect(workerReuses({reuse_count: 0})).toBe("");
    expect(workerReuses({})).toBe("");
    expect(workerReuses({reuse_count: 1})).toBe("Reused 1 time");
    expect(workerReuses({reuse_count: 2})).toBe("Reused 2 times");
});

test("an idle worker reads idle and waiting for a job, and a closed one says how it ended", () => {
    expect(workerTag(worker(1, "reported")).word).toBe("Idle, waiting for a job");
    expect(workerTag(worker(2, "reported", {adopted: true})).state).toBe("finished");
    expect(workerEnding(worker(2, "reported", {adopted: true}))).toBe("Retired");
    expect(workerEnding(worker(3, "stopped"))).toBe("Stopped");
    expect(workerFiles({files: "src/a.py, src/b.py"})).toBe("Files: src/a.py, src/b.py");
});

test("the workers list groups working, idle and retired, and the page offers a job to a worker not out", () => {
    const rows = [worker(1, "dispatched"), worker(2, "reported"), worker(3, "reported", {adopted: true}), worker(4, "stopped")];
    const sections = workersBySection(rows);
    expect([sections.working, sections.idle, sections.retired].map((rows) => rows.map((row) => row.id))).toEqual([[1], [2], [3, 4]]);
    expect(workerCounts(rows)).toEqual({working: 1, idle: 1});
    expect(workerActions(rows[0]).map((a) => a.key)).toEqual(["stop", "complete"]);
    expect(workerActions(rows[1]).map((a) => a.label)).toEqual(["Send a job", "Stop", "Complete"]);
    expect(workerActions(rows[3]).map((a) => a.key)).toEqual(["send"]);
});

test("an idle worker's row shows its reuse count and the files it was last on", async () => {
    const into = document.createElement("div");
    const app = createApp({render: () => h(WorkerRow, {row: worker(2, "reported", {reuse_count: 2, files: "src/parser.py"})})});
    app.directive("tip", {});
    app.mount(into);
    await nextTick();
    expect(into.textContent).toContain("Reused 2 times");
    expect(into.textContent).toContain("Files: src/parser.py");
    expect(into.textContent).toContain("Idle, waiting for a job");
});
