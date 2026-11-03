import {seconds} from "./row.js";
import {clock} from "../format/time.js";

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

export const workerState = (row) => (row.state === "reported" && row.adopted ? "finished" : STATES[row.state] || "running");

export const WORKER_WORDS = {running: "Working", ready: "Clocked out, ready to check", unfinished: "Ended without clocking out", reported: "Idle, waiting for a job", finished: "Closed"};

const ENDINGS = {stopped: "Stopped", merged: "Merged", released: "Released"};
const workerEnding = (row) => ENDINGS[row.state] || "Retired";

// The moves a worker made on its current job, from its dispatch or the job sent to it, each with its time, the last the one it is at,
// then the ones still to come before a merge. A worker from before moves were kept shows its dispatch and the move it is at.
const LATER = {dispatched: ["clocked in", "clocked out", "merged"], "clocked in": ["clocked out", "merged"], "clocked out": ["merged"]};
const JOB_STARTS = new Set(["dispatched", "sent a job"]);
const moveWord = (state) => state[0].toUpperCase() + state.slice(1);
const jobMoves = (steps) => steps.slice(Math.max(0, steps.findLastIndex(([move]) => JOB_STARTS.has(move))));
const madeMoves = (row) =>
    row.moves && row.moves.steps.length ? jobMoves(row.moves.steps) : [["dispatched", seconds(row.created_at)], ...(row.state === "dispatched" ? [] : [[row.state, stateAt(row)]])];

export function workerMoves(row) {
    const made = madeMoves(row);
    const later = (LATER[row.state] || []).map((state) => ({word: moveWord(state), time: "", at: "later"}));
    return [...made.map(([state, time], i) => ({word: moveWord(state), time: clock(time), at: i === made.length - 1 ? "now" : ""})), ...later];
}

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

export const FINISHED_STATES = new Set(["finished"]);
const stateAt = (row) => seconds(row.updated_at) || seconds(row.created_at);

export const workerName = (row) => row.name || `Worker ${row.id}`;

const workerHolding = (task, workers) => workers.find((row) => (row.holds || []).includes(task.id)) || null;

// The workers that hold a task of these, each once; of two with one name, the one still out.
export function workersHolding(tasks, workers) {
    const held = tasks.map((task) => workerHolding(task, workers)).filter(Boolean);
    const once = held.filter((row, i) => held.findIndex((other) => other.id === row.id) === i);
    const named = new Map();
    for (const row of once) {
        const kept = named.get(workerName(row));
        if (!kept || (FINISHED_STATES.has(workerState(kept)) && !FINISHED_STATES.has(workerState(row)))) named.set(workerName(row), row);
    }
    return once.filter((row) => named.get(workerName(row)) === row);
}

export const grouped = (run) => Boolean(run.holder) && run.rows.length > 1;
