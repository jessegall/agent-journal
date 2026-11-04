// A worker as the viewer draws it: out at work, clocked out with work to check, ended without clocking out, idle with its
// report back, or closed. A reported worker whose report was acted on is retired; a merged or released one is closed.
const STATES = {
    dispatched: "running",
    "clocked in": "running",
    "clocked out": "ready",
    "ended without clocking out": "unfinished",
    reported: "reported",
    stopped: "finished",
    merged: "finished",
    released: "finished",
};

const workerState = (row) => (row.state === "reported" && row.adopted ? "finished" : STATES[row.state] || "running");

export const WORKER_WORDS = {running: "Working", ready: "Review: ready", unfinished: "Work: unfinished", reported: "Status: idle", finished: "Closed"};

const ENDINGS = {stopped: "Stopped", merged: "Merged", released: "Released"};
const workerEnding = (row) => ENDINGS[row.state] || "Retired";

// What a worker is doing now, in plain words, from its row and the agent of its session: a merge taking its work in, its
// tests running, the step its agent is on, waiting for a machine or the usage limit, clocked out for the check, or idle with
// the tasks queued for it.
const queuedWords = (row) => {
    const queued = (row.queue || []).length;
    return queued ? `Queued: ${queued} ${queued === 1 ? "task" : "tasks"} queued` : "Status: idle";
};

export function workerActivity(row, agent = null) {
    const state = workerState(row);
    if (state === "finished") return workerEnding(row);
    if (row.merging) return "Work: merging";
    if (state === "ready") return "Review: pending";
    if (state === "reported") return queuedWords(row);
    if (state === "unfinished") return WORKER_WORDS.unfinished;
    if (row.state === "waiting for the usage limit") return "Waiting: usage limit";
    if ((row.runs || []).includes("testing")) return "Tests: running";
    return agent && agent.tool_running && agent.doing ? `Working: ${agent.doing}` : "Task: in progress";
}

export const grouped = (run) => Boolean(run.holder) && run.rows.length > 1;
