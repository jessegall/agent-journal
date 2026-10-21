import {envState} from "./journals.js";
import {seconds} from "./row.js";
import {subagentsOf} from "./subagents.js";
import {workerName, workerState} from "./workers.js";

// The agents grid: each environment's live agent, each worker, and the subagents of the agent here, as one kind of entry.
const STATES = {
    working: {word: "Working", dot: "running"},
    waiting: {word: "Needs you", dot: "you"},
    stuck: {word: "Stuck", dot: "failed"},
    stopped: {word: "Stopped", dot: ""},
    idle: {word: "Idle", dot: "queued"},
};
const KEYS = {working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "stuck", silent: "stuck", stopped: "stopped"};

export const agentState = (card) => {
    const key = KEYS[card.state] || "idle";
    return {key, ...STATES[key]};
};

export function splitTask(task) {
    const named = /^([^:]{2,32}): (.+)$/.exec(task || "");
    return named ? {name: named[1], job: named[2]} : {name: "Subagent", job: task || ""};
}

function environmentEntry(standing) {
    const agent = standing.agent;
    const title = standing.task?.title || agent.doing || "Nothing in hand";
    return {
        key: `environment:${standing.environment.name}`,
        env: standing.environment.name,
        kind: "environment",
        n: standing.environment.id,
        label: "Environment agent",
        name: standing.environment.name,
        title,
        says: agent.last_message || "",
        doing: agent.doing || "",
        model: agent.model || "",
        time: seconds(agent.heard_at),
        since: 0,
        waits: Boolean(standing.questions || agent.awaiting),
        opens: {table: "agents", id: agent.id},
        card: {state: envState(standing), reason: agent.stuck || agent.awaiting || ""},
    };
}

const WORKER_STATES = {running: "working", reported: "waiting", finished: "stopped"};

function workerEntry(worker, env) {
    return {
        key: `worker:${worker.id}`,
        env,
        kind: "worker",
        n: worker.id,
        label: "Worker",
        name: workerName(worker),
        title: worker.brief,
        says: "",
        doing: "",
        model: worker.model,
        time: seconds(worker.updated_at),
        since: workerState(worker) === "running" ? seconds(worker.created_at) : 0,
        waits: workerState(worker) === "reported",
        opens: {table: "workers", id: worker.id},
        card: {state: WORKER_STATES[workerState(worker)], reason: workerState(worker) === "reported" ? "its report waits for the agent" : ""},
    };
}

function subagentEntry(sub, agent, env) {
    return {
        key: `subagent:${sub.session}`,
        env,
        kind: "subagent",
        n: 0,
        sub: true,
        session: sub.session,
        label: "Subagent",
        name: splitTask(sub.task).name,
        title: splitTask(sub.task).job || sub.session,
        says: "",
        doing: sub.type || "",
        model: sub.model || "",
        time: sub.time,
        since: sub.running ? sub.time : 0,
        waits: false,
        opens: {table: "agents", id: agent.id, session: sub.session},
        card: {state: sub.running ? "working" : "idle", reason: sub.running ? "" : sub.status || "finished"},
    };
}

export function orchestraOf(summary, workers, lead, env) {
    const environments = ((summary && summary.environments) || []).filter((s) => s.agent).map(environmentEntry);
    const subs = lead ? subagentsOf(lead.id).map((sub) => subagentEntry(sub, lead, env)) : [];
    return [...environments, ...workers.map((w) => workerEntry(w, env)), ...subs];
}

const AMBER_AFTER = 300;
const RED_AFTER = 900;

export function quietOf(at, now) {
    const quiet = Math.max(0, now - at);
    const minutes = Math.floor(quiet / 60);
    return {
        ago: quiet < 60 ? "just now" : minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} h ${minutes % 60} min ago`,
        tone: quiet > RED_AFTER ? "red" : quiet > AMBER_AFTER ? "amber" : "",
    };
}

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
    {key: "subagent", label: "Subagents", icon: "agents", hidden: (n) => `${n} ${n === 1 ? "subagent" : "subagents"}`},
];

export const ORDERS = [
    {key: "number", label: "By number", icon: "list"},
    {key: "state", label: "By state", icon: "list"},
    {key: "active", label: "By last active", icon: "clock"},
];

const GROUP = {working: "working", waiting: "waiting", stuck: "waiting", idle: "idle", stopped: "stopped"};
export const stateGroup = (entry) => GROUP[agentState(entry.card).key] || "idle";

export function hiddenBy(entry, view) {
    if (view.states[stateGroup(entry)] === false) return stateGroup(entry);
    if (view.kinds[entry.kind] === false) return entry.kind;
    return "";
}

const byNumber = (a, b) => a.n - b.n || a.kind.localeCompare(b.kind) || a.key.localeCompare(b.key);

export const slotsFor = (slots, entries) => [...slots, ...entries.filter((e) => !slots.includes(e.key)).sort(byNumber).map((e) => e.key)];

const RANK = {waiting: 0, working: 1, idle: 2, stopped: 3};
const BY = {
    state: (a, b) => RANK[stateGroup(a)] - RANK[stateGroup(b)] || b.time - a.time,
    active: (a, b) => b.time - a.time,
};

export const ordered = (entries, order, slots = []) =>
    order === "number" ? [...entries].sort((a, b) => slots.indexOf(a.key) - slots.indexOf(b.key) || byNumber(a, b)) : [...entries].sort(BY[order] || BY.state);

const WORDS = Object.fromEntries([...STATE_SWITCHES, ...KIND_SWITCHES].map((s) => [s.key, s.hidden]));

export function hiddenSummary(entries, view) {
    const counts = {};
    entries.forEach((entry) => {
        const why = hiddenBy(entry, view);
        if (why) counts[why] = (counts[why] || 0) + 1;
    });
    return Object.entries(counts).map(([why, n]) => WORDS[why](n));
}
