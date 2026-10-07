import {providerName} from "./agents.js";
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
