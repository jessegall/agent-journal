import {providerName} from "./agents.js";
import {seconds} from "./row.js";

// A worker as the viewer draws it: out at work, back with a report, or closed. The journal keeps its state as dispatched,
// reported or stopped.
const STATES = {dispatched: "running", reported: "reported", stopped: "finished"};

export const workerState = (row) => STATES[row.state] || "running";

export const WORKER_WORDS = {running: "Working", reported: "Report ready", finished: "Closed"};

export const workerTag = (row) => ({state: workerState(row), word: WORKER_WORDS[workerState(row)]});

export const FINISHED_STATES = new Set(["finished"]);
const stateRank = (state) => ({running: 1, reported: 3})[state] ?? 4;
export const stateAt = (row) => seconds(row.updated_at) || seconds(row.created_at);

export const isWorking = (row) => workerState(row) === "running";

export const workerLine = (row) => [row.provider ? providerName(row.provider, row.provider) : "", row.model].filter(Boolean).join(" · ");

export const workerName = (row) => row.name || `Worker ${row.id}`;

export const workerReuses = (row) => (row.reuse_count ? `Reused ${row.reuse_count} ${row.reuse_count === 1 ? "time" : "times"}` : "");
export const workerReport = (row) => row.report || "";

const SECTION_OF = {running: "working", reported: "waiting", finished: "retired"};

export function workersBySection(rows) {
    const ordered = [...rows].sort((a, b) => stateRank(workerState(a)) - stateRank(workerState(b)) || stateAt(b) - stateAt(a));
    const sections = {working: [], waiting: [], closed: [], retired: []};
    ordered.forEach((row) => sections[SECTION_OF[workerState(row)] || "working"].push(row));
    return sections;
}

export const workerCounts = (rows) => ({
    working: rows.filter(isWorking).length,
    reported: rows.filter((row) => workerState(row) === "reported").length,
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
