import {providerName} from "./agents.js";
import {seconds} from "./row.js";

// A worker as the viewer draws it: out at work, idle with its report back and waiting for a job, or closed. The journal
// keeps its state as dispatched, reported or stopped, and a reported worker whose report was acted on is retired.
const STATES = {dispatched: "running", reported: "reported", stopped: "finished"};

export const workerState = (row) => (row.state === "reported" && row.adopted ? "finished" : STATES[row.state] || "running");

export const WORKER_WORDS = {running: "Working", reported: "Idle, waiting for a job", finished: "Closed"};

export const workerEnding = (row) => (row.state === "stopped" ? "Stopped" : "Retired");

export const workerFiles = (row) => (row.files ? `Files: ${row.files}` : "");

const SEND = {key: "send", label: "Send a job", title: "It goes on in its last session, with its memory of the work so far.", confirm: {text: "The job to send it:", input: "What it should do next", button: "Send the job", cancel: "Cancel"}};
const STOP = {key: "stop", label: "Stop", title: "It stops at once. Its branch and files stay.", danger: true, confirm: {text: "Stop this worker now? A job sent to it later goes on in its last session.", button: "Stop now", cancel: "Keep it"}};
const COMPLETE = {key: "complete", label: "Complete", title: "Its work is taken in or set aside, and it is retired."};

// What the worker page offers: a job for a worker that is not out, a stop for one out or idle, and completing one not yet retired.
export function workerActions(row) {
    const state = workerState(row);
    if (state === "running") return [STOP, COMPLETE];
    if (state === "reported") return [SEND, STOP, COMPLETE];
    return [SEND];
}

export const workerTag = (row) => ({state: workerState(row), word: WORKER_WORDS[workerState(row)]});

export const FINISHED_STATES = new Set(["finished"]);
const stateRank = (state) => ({running: 1, reported: 3})[state] ?? 4;
export const stateAt = (row) => seconds(row.updated_at) || seconds(row.created_at);

export const isWorking = (row) => workerState(row) === "running";

export const workerLine = (row) => [row.provider ? providerName(row.provider, row.provider) : "", row.model].filter(Boolean).join(" · ");

export const workerName = (row) => row.name || `Worker ${row.id}`;

export const workerReuses = (row) => (row.reuse_count ? `Reused ${row.reuse_count} ${row.reuse_count === 1 ? "time" : "times"}` : "");
export const workerReport = (row) => row.report || "";

const SECTION_OF = {running: "working", reported: "idle", finished: "retired"};

export function workersBySection(rows) {
    const ordered = [...rows].sort((a, b) => stateRank(workerState(a)) - stateRank(workerState(b)) || stateAt(b) - stateAt(a));
    const sections = {working: [], idle: [], retired: []};
    ordered.forEach((row) => sections[SECTION_OF[workerState(row)] || "working"].push(row));
    return sections;
}

export const workerCounts = (rows) => ({
    working: rows.filter(isWorking).length,
    idle: rows.filter((row) => workerState(row) === "reported").length,
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
