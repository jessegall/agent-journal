const PLURALS = {processes: "process", memories: "memory", replies: "reply"};
const HIDDEN = new Set(["id", "version", "metadata", "title", "brief", "body", "abstract"]);

// the command name of a row's kind, from the table or model name a reference holds: plans:5 and plan:5 both read plan
export const cliOf = (table) => (PLURALS[table] ?? table.replace(/s$/, "")).replace(/_/g, "-");

export const titleOf = (kind, row, id) => row?.title || row?.name || `${kind} ${id}`;

// the fields of a row with no page of its own: everything but what the head and the text already show, empty ones left out
export const fieldsOf = (row) => Object.entries(row ?? {}).filter(([name, value]) => !HIDDEN.has(name) && value !== null && value !== "" && typeof value !== "object");

const CANCEL = {word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?"};

const PLAN_MOVES = {
    draft: [{word: "ready", label: "Mark ready"}, CANCEL],
    ready: [{word: "approve", label: "Approve", main: true}, CANCEL],
    approved: [{word: "start", label: "Start", main: true}, CANCEL],
    started: [{word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?"}, {word: "close", label: "Close"}, CANCEL],
    blocked: [{word: "unblock", label: "Resume", main: true}, CANCEL],
    completed: [],
    cancelled: [],
};

const TASK_MOVES = {
    open: [{word: "start", label: "Start", main: true}, {word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?"}, CANCEL],
    started: [{word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: true}, {word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?"}, CANCEL],
    testing: [{word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: true}, {word: "retest", label: "Back to work"}, CANCEL],
    blocked: [{word: "unblock", label: "Unblock", main: true}, CANCEL],
    completed: [{word: "reopen", label: "Reopen"}],
    cancelled: [{word: "reopen", label: "Reopen"}],
};

// what a person can do to a row in its state; a move with a flag asks for its words first
export const movesOf = (kind, row) => ({plan: PLAN_MOVES, task: TASK_MOVES})[kind]?.[row?.state] ?? [];
