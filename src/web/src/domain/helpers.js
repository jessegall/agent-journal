import {workMode} from "../composables/settings.js";
import {providerName} from "./agents.js";
import {ORCHESTRATOR} from "./modes.js";
export const helperState = (row) => row.state || (row.completed ? "finished" : row.data?.report ? "reported" : "running");

export const HELPER_WORDS = {
    needs: "Needs you",
    working: "Working",
    running: "Working",
    idle: "Idle",
    reported: "Report ready",
    finished: "Closed",
    stopped: "Stopped",
    ended: "Ended, no report",
    refused: "Refused",
};

const ORCHESTRATED_WORDS = {...HELPER_WORDS, needs: "Waits for answer"};

export const helperWords = (mode = workMode.value) => (mode === ORCHESTRATOR ? ORCHESTRATED_WORDS : HELPER_WORDS);
export const helperWord = (state, mode) => helperWords(mode)[state];

export const helperAsking = (row, environments = []) => {
    const attention = environments.find((one) => one.owner === `helper:${row.n}`)?.attention;
    return attention?.kind === "question" ? attention.text : "";
};

export const helperTag = (row, mode = workMode.value) => {
    const state = row.asking ? "needs" : helperState(row);
    const word = row.asking && mode !== ORCHESTRATOR ? "Asks a question" : helperWord(state, mode);
    return {state, word};
};

export const FINISHED_STATES = new Set(["finished", "stopped", "ended", "refused"]);
export const stateRank = (state) => ({needs: 0, working: 1, running: 1, idle: 2, reported: 3})[state] ?? 4;
export const stateAt = (row) => row.completed || row.completed_at || row.ended || row.at || row.started || 0;

export function agentsInOrder(rows) {
    return [...rows].sort((a, b) => stateRank(a.state) - stateRank(b.state) || stateAt(b) - stateAt(a));
}

export function agentsListed(rows, older = false) {
    const open = agentsInOrder(rows.filter((row) => !FINISHED_STATES.has(row.state)));
    const finished = agentsInOrder(rows.filter((row) => FINISHED_STATES.has(row.state)));
    return older ? [...open, ...finished] : [...open, ...finished.slice(0, 3)];
}

const WORKING_STATES = new Set(["working", "running", "idle"]);
export const isWorking = (row) => WORKING_STATES.has(helperState(row));

export function agentCounts(helpers, subagents, now = Date.now() / 1000) {
    const rows = [...helpers, ...subagents];
    return {
        needs: rows.filter((row) => row.state === "needs").length,
        working: rows.filter(isWorking).length,
        reported: helpers.filter((row) => row.state === "reported").length,
        finished: rows.filter((row) => FINISHED_STATES.has(row.state) && now - stateAt(row) <= 3600).length,
    };
}

const providerLabel = (provider) => (provider ? providerName(provider, provider) : "");

export const helperLine = (row) =>
    [providerLabel(row.provider || row.data?.provider), row.model || row.data?.model].filter(Boolean).join(" · ");

export function helpersInOrder(rows, keepFinished = 5) {
    const open = rows.filter((row) => helperState(row) !== "finished");
    const done = rows
        .filter((row) => helperState(row) === "finished")
        .slice(-keepFinished)
        .reverse();
    return [...open.filter((row) => helperState(row) === "running"), ...open.filter((row) => helperState(row) === "reported"), ...done];
}

export const helperName = (row) => row.data?.name || `Helper ${row.n}`;
export const helperEnvironment = (row) => row.data?.environment;
export const helperReport = (row) => row.data?.report || "";

export function helpersByState(rows) {
    const ordered = helpersInOrder(rows, rows.length);
    return {
        open: ordered.filter((row) => helperState(row) !== "finished"),
        closed: ordered.filter((row) => helperState(row) === "finished"),
    };
}

export const helperCounts = (rows) => ({
    working: rows.filter(isWorking).length,
    reported: rows.filter((row) => helperState(row) === "reported").length,
});

export const helperCard = (row) => ({
    type: "helper",
    n: row.n,
    title: row.title,
    session: "",
    state: helperState(row) === "running" ? "running" : "idle",
    reason: row.asking ? `Asks a question: ${row.asking}` : "",
});

export const helperHolding = (todo, helpers) => helpers.find((row) => `helper:${row.n}` === todo.data?.assigned) || null;

const ASSIGNED_HELPER = /^helper:(\d+)$/;

export function holdingHelpers(todos) {
    const numbers = todos.map((todo) => String(todo.data?.assigned || "").match(ASSIGNED_HELPER)).filter(Boolean).map((found) => Number(found[1]));
    return [...new Set(numbers)];
}

export function helpersHolding(todos, helpers) {
    const held = todos.map((todo) => helperHolding(todo, helpers)).filter(Boolean);
    const once = held.filter((row, i) => held.findIndex((other) => other.n === row.n) === i);
    const named = new Map();
    for (const row of once) {
        const kept = named.get(helperName(row));
        if (!kept || (FINISHED_STATES.has(helperState(kept)) && !FINISHED_STATES.has(helperState(row)))) named.set(helperName(row), row);
    }
    return once.filter((row) => named.get(helperName(row)) === row);
}

export function holdingRuns(todos, helpers) {
    const runs = [];
    for (const todo of todos) {
        const holder = helperHolding(todo, helpers);
        const last = runs.at(-1);
        if (last && holder && last.holder && last.holder.n === holder.n) last.rows.push(todo);
        else runs.push({holder: holder || null, rows: [todo]});
    }
    return runs;
}

export const grouped = (run) => Boolean(run.holder) && run.rows.length > 1;
