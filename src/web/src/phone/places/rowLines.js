import {checkState, VERDICTS} from "../../domain/checks.js";
import {PLAN_STATES, doneOf, phaseOf, rowsOf} from "../../domain/plans.js";
import {counted} from "../../format/number.js";
import {ago} from "../../format/time.js";

const DECISIONS = {accept: "Accepted", adjust: "Adjusted", decline: "Declined"};

const asked = (row) => (row.completed ? (row.data.dismissed ? "Dismissed" : `Answered: ${row.outcome}`) : "Needs your answer");

const BITS = {
    plan: (row, todos) => {
        const phases = row.data.phases || [];
        if (!phases.length) return [PLAN_STATES[row.data.status] || "", "No phases yet"];
        return [
            PLAN_STATES[row.data.status] || "",
            `Phase ${row.data.current || 1} of ${phases.length}: ${phaseOf(row)}`,
            `${doneOf(row, todos)} of ${counted(rowsOf(row).length, "to-do")} done`,
        ];
    },
    question: (row) => [asked(row)],
    suggestion: (row) => [row.completed ? DECISIONS[row.data.decision] || "Answered" : "Waits for your answer"],
    ticket: (row) => [row.data.stage || ""],
    collection: (row) => [counted(row.refs.length, "item")],
    work: (row) => [row.data.parked ? `Paused: ${row.data.parked}` : row.completed ? "" : "In hand"],
    check: (row) => [VERDICTS[checkState(row, Date.now() / 1000).verdict]],
    todo: (row) => [row.data.blocked ? `Blocked: ${row.data.blocked}` : ""],
};

const when = (row) => (row.completed ? `Closed ${ago(row.completed)}` : ago(row.updated || row.created));

export const linesOf = (kind, row, todos = []) =>
    [`${kind.one} ${row.n}`, ...(BITS[row.type] || (() => []))(row, todos), when(row)].filter(Boolean);

const WAITING = ["question", "suggestion"];

export function dotOf(row) {
    if (row.completed) return "done";
    if (row.data.blocked) return "blocked";
    if (WAITING.includes(row.type) || row.data.status === "waiting" || row.data.status === "ready") return "waiting";
    if (row.data.status === "active" || row.data.status === "started" || (row.type === "work" && !row.data.parked)) return "doing";
    return "";
}
