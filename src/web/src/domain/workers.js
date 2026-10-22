import {providerName} from "./agents.js";
import {seconds} from "./row.js";

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
export const workerEnding = (row) => ENDINGS[row.state] || "Retired";

export const workerFiles = (row) => (row.files ? `Files: ${row.files}` : "");

const SEND = {key: "send", label: "Send a job", title: "It goes on in its last session, with its memory of the work so far.", confirm: {text: "The job to send it:", input: "What it should do next", button: "Send the job", cancel: "Cancel"}};
const STOP = {key: "stop", label: "Stop", title: "It stops at once. Its branch and files stay.", danger: true, confirm: {text: "Stop this worker now? A job sent to it later goes on in its last session.", button: "Stop now", cancel: "Keep it"}};
const COMPLETE = {key: "complete", label: "Complete", title: "Its work is taken in or set aside, and it is retired."};
const MERGE = {key: "merge", label: "Merge its work", title: "Its branch is taken in and its task closed, once every point's proof is checked."};
const RELEASE = {key: "release", label: "Release its task", title: "The task is free again, for another worker or the agent.", confirm: {text: "Let this worker go and free its task?", button: "Release", cancel: "Keep it"}};

// What the worker page offers: a stop or completing for one out, a merge for one that clocked out, a job or a release for one that ended
// without clocking out, a job, a stop or completing for one idle with its report, and a job for one closed.
const ACTIONS_OF = {running: [STOP, COMPLETE], ready: [MERGE], unfinished: [SEND, RELEASE], reported: [SEND, STOP, COMPLETE]};

// A worker another machine runs is acted on only there, so this machine offers none of its actions.
export function workerActions(row, device = "") {
    if ((row.device || "") !== device) return [];
    const state = workerState(row);
    return ACTIONS_OF[state] || [SEND];
}

export const workerTag = (row) => ({state: workerState(row), word: WORKER_WORDS[workerState(row)]});

export const FINISHED_STATES = new Set(["finished"]);
const stateRank = (state) => ({running: 1, ready: 2, unfinished: 2, reported: 3})[state] ?? 4;
export const stateAt = (row) => seconds(row.updated_at) || seconds(row.created_at);

export const isWorking = (row) => workerState(row) === "running";

export const workerLine = (row) => [row.provider ? providerName(row.provider, row.provider) : "", row.model].filter(Boolean).join(" · ");

export const workerName = (row) => row.name || `Worker ${row.id}`;

export const workerReuses = (row) => (row.reuse_count ? `Reused ${row.reuse_count} ${row.reuse_count === 1 ? "time" : "times"}` : "");
export const workerReport = (row) => row.report || "";

const SECTION_OF = {running: "working", ready: "idle", unfinished: "idle", reported: "idle", finished: "retired"};

export function workersBySection(rows) {
    const ordered = [...rows].sort((a, b) => stateRank(workerState(a)) - stateRank(workerState(b)) || stateAt(b) - stateAt(a));
    const sections = {working: [], idle: [], retired: []};
    ordered.forEach((row) => sections[SECTION_OF[workerState(row)] || "working"].push(row));
    return sections;
}

export const workerCounts = (rows) => ({
    working: rows.filter(isWorking).length,
    idle: rows.filter((row) => ["ready", "unfinished", "reported"].includes(workerState(row))).length,
});

export const workerCard = (row) => ({table: "workers", id: row.id, title: workerName(row), session: "", state: isWorking(row) ? "running" : "idle", reason: ""});

export const workerHolding = (task, workers) => workers.find((row) => row.id === task.worker_id) || null;

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

// Tasks in runs of the worker that holds them, so a worker's tasks stand together under it.
export function holdingRuns(tasks, workers) {
    const runs = [];
    for (const task of tasks) {
        const holder = workerHolding(task, workers);
        const last = runs.at(-1);
        if (last && holder && last.holder && last.holder.id === holder.id) last.rows.push(task);
        else runs.push({holder: holder || null, rows: [task]});
    }
    return runs;
}

export const grouped = (run) => Boolean(run.holder) && run.rows.length > 1;
