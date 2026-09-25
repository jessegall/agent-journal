import {envState, focusOf, isActive} from "../sync/hub.js";
import {rows} from "../sync/rows.js";
import {agentState} from "./ticketAgents.js";

const SILENT_AFTER = 300;
const OWNED = /^(ticket|plan):(\d+)$/;
const LABELS = {ticket: (n) => `#${n}`, plan: (n) => `Plan ${n}`};
const PLAN_WAITS = {ready: "its plan waits for your approval", waiting: "its plan is at a checkpoint"};

const fileName = (path) => (path || "").split("/").pop();

function standing(e, plan, now) {
    const state = envState(e);
    const counts = e.counts || {};
    if (state === "stopped") return {state: "stopped", reason: "its agent is not running"};
    if (counts.prompts) return {state: "you", reason: "a permission waits for you"};
    if (e.agent.asking || counts.questions) return {state: "you", reason: "a question waits for you"};
    if (plan && PLAN_WAITS[plan.status]) return {state: "you", reason: PLAN_WAITS[plan.status]};
    if (!isActive(state)) return {state: "idle", reason: "idle"};
    if (now - (e.agent.at || now) > SILENT_AFTER) return {state: "you", reason: `silent for ${Math.floor((now - e.agent.at) / 60)}m`};
    return {state: "running", reason: ""};
}

function entryOf(e, now) {
    const [, kind = "", n = "0"] = OWNED.exec(e.owner) || [];
    const row = kind ? rows(kind).find((r) => r.n === Number(n)) : null;
    const plan = (e.plans || []).find((p) => p.status !== "done") || (e.plans || [])[0] || null;
    const focus = focusOf(e);
    const tool = e.agent && e.agent.tool ? `${e.agent.tool} ${fileName(e.agent.file)}`.trim() : "";
    const {state, reason} = standing(e, plan, now);
    const title = (row && row.title) || focus.title;
    return {
        key: e.name,
        env: e.name,
        kind,
        n: Number(n),
        label: LABELS[kind] ? LABELS[kind](n) : e.owner,
        title,
        now: tool || (focus.known ? focus.title : ""),
        plan,
        at: (e.agent && e.agent.at) || 0,
        waits: Boolean((e.work && e.work.awaiting) || (e.counts || {}).questions || (e.agent && e.agent.asking)),
        card: {type: "ticket", n: Number(n), title, session: "", state, reason: reason || tool},
    };
}

function subagentsOf(e) {
    const [, kind = "", n = "0"] = OWNED.exec(e.owner) || [];
    const parent = kind ? LABELS[kind](n) : "the main agent";
    return (e.subagents || []).map((sub) => ({
        key: `${e.name}:${sub.session}`,
        env: e.name,
        kind: "subagent",
        n: 0,
        sub: true,
        parent: sub.parent,
        session: sub.session,
        label: "Subagent",
        of: `of ${parent}`,
        title: sub.task || sub.session,
        now: [sub.type, sub.model].filter(Boolean).join(" · "),
        plan: null,
        at: sub.running ? sub.at : sub.ended || sub.at,
        waits: false,
        card: {
            type: "agent",
            n: sub.parent,
            title: sub.task,
            session: sub.session,
            state: sub.running ? "running" : "idle",
            reason: sub.running ? "" : sub.status || "finished",
        },
    }));
}

export const orchestraOf = (environments, now) =>
    (environments || []).flatMap((e) => [...(e.owner ? [entryOf(e, now)] : []), ...subagentsOf(e)]);

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
    kinds: {ticket: true, plan: true, subagent: true},
    unfinished: false,
    order: "state",
};

export const STATE_SWITCHES = [
    {key: "working", label: "Working", icon: "agents", hidden: (n) => `${n} working`},
    {key: "waiting", label: "Waiting for you or stuck", icon: "warn", hidden: (n) => `${n} waiting or stuck`},
    {key: "idle", label: "Idle", icon: "pause", hidden: (n) => `${n} idle`},
    {key: "stopped", label: "Not running", icon: "x", hidden: (n) => `${n} not running`},
];

export const KIND_SWITCHES = [
    {key: "ticket", label: "Ticket agents", icon: "ticket", hidden: (n) => `${n} ${n === 1 ? "ticket agent" : "ticket agents"}`},
    {key: "plan", label: "Plan agents", icon: "flag", hidden: (n) => `${n} ${n === 1 ? "plan agent" : "plan agents"}`},
    {key: "subagent", label: "Subagents", icon: "agents", hidden: (n) => `${n} ${n === 1 ? "subagent" : "subagents"}`},
];

export const ORDERS = [
    {key: "state", label: "By state", icon: "list"},
    {key: "ticket", label: "By ticket", icon: "ticket"},
    {key: "active", label: "By last active", icon: "clock"},
];

const GROUP = {working: "working", waiting: "waiting", stuck: "waiting", idle: "idle", stopped: "stopped"};
export const stateGroup = (entry) => GROUP[agentState(entry.card).key] || "idle";
const unfinished = (entry) => Boolean(entry.plan) && entry.plan.status !== "done";

export function hiddenBy(entry, view) {
    if (!view.states[stateGroup(entry)]) return stateGroup(entry);
    if (!view.kinds[entry.kind || "ticket"]) return entry.kind || "ticket";
    if (view.unfinished && !unfinished(entry)) return "unfinished";
    return "";
}

const RANK = {waiting: 0, working: 1, idle: 2, stopped: 3};
const BY = {
    state: (a, b) => RANK[stateGroup(a)] - RANK[stateGroup(b)] || b.at - a.at,
    ticket: (a, b) => (a.kind || "").localeCompare(b.kind || "") || a.n - b.n,
    active: (a, b) => b.at - a.at,
};

export const ordered = (entries, order) => [...entries].sort(BY[order] || BY.state);

const WORDS = Object.fromEntries(
    [...STATE_SWITCHES, ...KIND_SWITCHES, {key: "unfinished", hidden: (n) => `${n} without an unfinished plan`}].map((s) => [
        s.key,
        s.hidden,
    ])
);

export function hiddenSummary(entries, view) {
    const counts = {};
    entries.forEach((entry) => {
        const why = hiddenBy(entry, view);
        if (why) counts[why] = (counts[why] || 0) + 1;
    });
    return Object.entries(counts).map(([why, n]) => WORDS[why](n));
}
