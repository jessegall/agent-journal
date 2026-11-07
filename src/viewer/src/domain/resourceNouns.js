import {stateLook, stateOpenMoves} from "@journal/window-kit";
import {wordLabel} from "./labels.js";

export {cliOf} from "./modelNames.js";
const HIDDEN = new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]);
const firstUpper = (words) => words.charAt(0).toUpperCase() + words.slice(1);
const fieldLabel = (name) => firstUpper(name.replace(/_at$/, "").replaceAll("_", " "));

export const titleOf = (noun, row, id) => row?.title || row?.name || `${noun} ${id}`;

// what the panel's head says of a row with no page of its own: its type and number, then its state
export const headingOf = (noun, row, id) => [firstUpper(`${noun} ${id}`), row?.state && firstUpper(row.state)].filter(Boolean).join(" · ");

// an agent by name: the one it was given, otherwise its role and number, such as Worker 412
const agentNameOf =(agent) => agent.given_name || `${wordLabel(agent.role)} ${agent.id}`;

// who made a row, by name: an agent's name, otherwise the name of the actor; "" while the creator is not read
export const creatorNameOf = (actor, agent) => (actor?.type === "agent" && agent ? agentNameOf(agent) : actor?.name ?? "");

// who a row belongs to, by name, for a row an agent owns: the main agent when no agent does; "" for a row no agent owns
export const ownerNameOf = (row, agent) => (!row || !("agent_id" in row) ? "" : row.agent_id === null ? "Main agent" : agent ? agentNameOf(agent) : "");

// the fields of a row with no page of its own, with a label a person reads: everything but what the head and the text already show,
// empty ones, row numbers and an unchanged updated time left out; the names of whom the row belongs to and who made it stand in for their row numbers,
// and the task it is tied to is a link
export const fieldsOf = (row, shownText = "", creator = "", owner = "") => [
    ...(owner ? [{name: "owner", label: "Belongs to", value: owner, isTime: false}] : []),
    ...(creator ? [{name: "creator", label: "Created by", value: creator, isTime: false}] : []),
    ...Object.entries(row ?? {})
        .filter(([name, value]) => !HIDDEN.has(name) && !name.endsWith("_id") && value !== null && value !== "" && typeof value !== "object" && value !== shownText)
        .filter(([name, value]) => name !== "updated_at" || value !== row.created_at)
        .map(([name, value]) => ({name, label: fieldLabel(name), value, isTime: name.endsWith("_at")})),
    ...(row?.task_id ? [{name: "task", label: "Task", value: `Task ${row.task_id}`, isTime: false, link: {table: "tasks", id: row.task_id}}] : []),
];

const STATE_BADGES = {reviewing: "Under review"};

// the badge a docked row shows: the one its dock declares, or the one its state asks for
export const dockBadgeOf = (declared, row) => declared || STATE_BADGES[row?.state] || "";

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

const textMoves = (row) => (!row || row.close_reason ? [] : [{word: "close", label: "Needs no action", icon: "check", bordered: true, flag: "--why", ask: "Why does it need no action?"}]);

// the moves of a plan or a task: an added state keeps those of the state it looks like that it may also take
function stateMoves(noun, row) {
    const table = {plan: PLAN_MOVES, task: TASK_MOVES}[noun];
    const open = row?.state ? stateOpenMoves(noun, row.state) : null;
    if (!open) return table?.[row?.state] ?? [];
    return (table?.[stateLook(noun, row.state)] ?? []).filter((move) => open.includes(move.word));
}

export const movesOf = (noun, row) => (noun === "doc" || noun === "report" ? textMoves(row).map(move => ({...move, word: noun === "doc" ? "settle" : move.word})) : noun === "agent" ? [...workerMoves(row), ...agentMoves(row)] : stateMoves(noun, row));
