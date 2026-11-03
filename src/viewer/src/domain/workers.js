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

export const WORKER_WORDS = {running: "Working", ready: "Clocked out, ready to check", unfinished: "Ended without clocking out", reported: "Idle, waiting for a job", finished: "Closed"};

const ENDINGS = {stopped: "Stopped", merged: "Merged", released: "Released"};
const workerEnding = (row) => ENDINGS[row.state] || "Retired";

// What a worker is doing now, in plain words, from its row and the agent of its session: a merge taking its work in, its
// tests running, the step its agent is on, waiting for a machine or the usage limit, clocked out for the check, or idle with
// the tasks queued for it.
const queuedWords = (row) => {
    const queued = (row.queue || []).length;
    return queued ? `Idle, ${queued} ${queued === 1 ? "task" : "tasks"} queued` : "Idle, waiting for a job";
};

export function workerActivity(row, agent = null) {
    const state = workerState(row);
    if (state === "finished") return workerEnding(row);
    if (row.merging) return "Its work is being merged";
    if (state === "ready") return "Clocked out, waiting for its work to be checked";
    if (state === "reported") return queuedWords(row);
    if (state === "unfinished") return WORKER_WORDS.unfinished;
    if (row.state === "waiting for the usage limit") return "Waiting for the usage limit";
    if ((row.runs || []).includes("testing")) return "Running its tests";
    return agent && agent.tool_running && agent.doing ? `Working: ${agent.doing}` : "Working on its task";
}

export const grouped = (run) => Boolean(run.holder) && run.rows.length > 1;
