import {stateLook, stateOpenMoves} from "@journal/window-kit";

export {cliOf} from "./modelNames.js";
const HIDDEN = new Set(["id", "version", "metadata", "title", "brief", "body", "abstract"]);

export const titleOf = (kind, row, id) => row?.title || row?.name || `${kind} ${id}`;

// the fields of a row with no page of its own: everything but what the head and the text already show, empty ones left out
export const fieldsOf = (row) => Object.entries(row ?? {}).filter(([name, value]) => !HIDDEN.has(name) && value !== null && value !== "" && typeof value !== "object");

const CANCEL = {word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?"};

const PLAN_MOVES = {
    draft: [{word: "ready", label: "Mark ready"}, CANCEL],
    ready: [CANCEL],
    approved: [{word: "start", label: "Start", main: true}, CANCEL],
    started: [{word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?"}, {word: "close", label: "Close"}, CANCEL],
    blocked: [{word: "unblock", label: "Resume", main: true}, CANCEL],
    completed: [],
    cancelled: [],
};

const TASK_MOVES = {
    open: [{word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)"}, CANCEL],
    started: [{word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: true}, {word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)"}, CANCEL],
    testing: [{word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: true}, {word: "retest", label: "Back to work"}, CANCEL],
    blocked: [{word: "unblock", label: "Unblock", main: true}, CANCEL],
    completed: [{word: "reopen", label: "Reopen"}],
    cancelled: [{word: "reopen", label: "Reopen"}],
};

// what a person can do to a row in its state; a move with a flag asks for its words first
const questionMoves = (row) => (row?.state !== "open" ? [] : [
    ...(row.options ?? []).map((option) => ({word: "answer", label: option === row.recommended ? `${option} (recommended)` : option, flag: "--answer", said: option, main: option === row.recommended})),
    {word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer"},
    {word: "close", label: "Close"},
]);

// what a person can do to an agent: hold it or let it carry on, and stop its program after asking
const agentMoves = (row) => (!row || row.ended_at ? [] : [
    row.paused_at ? {word: "resume", label: "Resume", main: true} : {word: "pause", label: "Pause"},
    {word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: true},
]);

// a worker is an agent too, with its own commands: its work merged, or it taken off its task; a job or a reason goes after its number
const workerMoves = (row) => (row?.role !== "worker" || row.ended_at ? [] : [
    {noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: true},
    {noun: "worker", word: "merge", label: "Merge", main: true, confirm: "Merge its work? Each point needs a checked proof."},
    {noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: true},
]);

const checkMoves = (row) => (!row || row.removed_at ? [] : [row.stopped ? {word: "run", label: "Start again", main: true} : {word: "run", label: "Run now", main: true}, ...(row.stopped ? [] : [{word: "stop", label: "Stop"}])]);

const textMoves = (row) => (!row || row.close_reason ? [] : [{word: "close", label: "Needs no action", icon: "check", bordered: true, flag: "--why", ask: "Why does it need no action?"}]);

// the moves of a plan or a task: an added state keeps those of the state it looks like that it may also take
function stateMoves(kind, row) {
    const table = {plan: PLAN_MOVES, task: TASK_MOVES}[kind];
    const open = row?.state ? stateOpenMoves(kind, row.state) : null;
    if (!open) return table?.[row?.state] ?? [];
    return (table?.[stateLook(kind, row.state)] ?? []).filter((move) => open.includes(move.word));
}

export const movesOf = (kind, row) => (kind === "doc" || kind === "report" ? textMoves(row) : kind === "agent" ? [...workerMoves(row), ...agentMoves(row)] : kind === "check" ? checkMoves(row) : kind === "question" ? questionMoves(row) : stateMoves(kind, row));
