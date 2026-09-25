import {envState, focusOf, isActive} from "../sync/hub.js";
import {rows} from "../sync/rows.js";

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

export const orchestraOf = (environments, now) => (environments || []).filter((e) => e.owner).map((e) => entryOf(e, now));

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

export function gridColumns(count) {
    if (count <= 1) return 1;
    return count <= 4 ? 2 : 3;
}
