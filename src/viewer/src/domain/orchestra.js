// The agents grid: each environment's live agent, each worker, and the subagents of the agent here, as one kind of entry.
const STATES = {
    working: {word: "Working", dot: "running"},
    waiting: {word: "Waiting", dot: "you"},
    stuck: {word: "Stuck", dot: "failed"},
    stopped: {word: "Stopped", dot: ""},
    idle: {word: "Idle", dot: "queued"},
};
const KEYS = {working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "stuck", silent: "stuck", stopped: "stopped"};

export const agentState = (card) => {
    const key = KEYS[card.state] || "idle";
    return {key, ...STATES[key]};
};

const GIGABYTE = 1024 ** 3;
const MEGABYTE = 1024 ** 2;

export const AGENT_VIEW = {
    states: {working: true, waiting: true, idle: true, stopped: true},
    kinds: {environment: true, worker: true, subagent: true},
    unfinished: false,
    order: "number",
};

export const STATE_SWITCHES = [
    {key: "working", label: "Working", icon: "agents", hidden: (n) => `${n} working`},
    {key: "waiting", label: "Blocked", icon: "warn", hidden: (n) => `${n} blocked`},
    {key: "idle", label: "Idle", icon: "pause", hidden: (n) => `${n} idle`},
    {key: "stopped", label: "Not running", icon: "x", hidden: (n) => `${n} not running`},
];

export const KIND_SWITCHES = [
    {key: "environment", label: "Environment agents", icon: "branch", hidden: (n) => `${n} ${n === 1 ? "environment agent" : "environment agents"}`},
    {key: "worker", label: "Workers", icon: "agents", hidden: (n) => `${n} ${n === 1 ? "worker" : "workers"}`},
    {key: "subagent", label: "Subagents", icon: "agents", hidden: (n) => `${n} ${n === 1 ? "helper" : "helpers"}`},
];

export const ORDERS = [
    {key: "number", label: "By number", icon: "list"},
    {key: "state", label: "By state", icon: "list"},
    {key: "active", label: "By last active", icon: "clock"},
];

const GROUP = {working: "working", waiting: "waiting", stuck: "waiting", idle: "idle", stopped: "stopped"};
const stateGroup = (entry) => GROUP[agentState(entry.card).key] || "idle";

export function hiddenBy(entry, view) {
    if (view.states[stateGroup(entry)] === false) return stateGroup(entry);
    if (view.kinds[entry.kind] === false) return entry.kind;
    return "";
}

const byNumber = (a, b) => a.n - b.n || a.kind.localeCompare(b.kind) || a.key.localeCompare(b.key);

// Working agents always come first, then those waiting for input, then the idle and the stopped; the order picked sorts within each.
const RANK = {working: 0, waiting: 1, idle: 2, stopped: 3};
const byRank = (a, b) => RANK[stateGroup(a)] - RANK[stateGroup(b)];
const BY = {
    state: (a, b) => b.time - a.time,
    active: (a, b) => b.time - a.time,
};

export const ordered = (entries, order, slots = []) =>
    order === "number"
        ? [...entries].sort((a, b) => byRank(a, b) || slots.indexOf(a.key) - slots.indexOf(b.key) || byNumber(a, b))
        : [...entries].sort((a, b) => byRank(a, b) || (BY[order] || BY.state)(a, b));

const WORDS = Object.fromEntries([...STATE_SWITCHES, ...KIND_SWITCHES].map((s) => [s.key, s.hidden]));

export function hiddenSummary(entries, view) {
    const counts = {};
    entries.forEach((entry) => {
        const why = hiddenBy(entry, view);
        if (why) counts[why] = (counts[why] || 0) + 1;
    });
    return Object.entries(counts).map(([why, n]) => WORDS[why](n));
}
