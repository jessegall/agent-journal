import {counted} from "../format/number.js";

export const NOT_STARTED = {
    building: "being written",
    draft: "a draft",
    ready: "waiting for your approval",
    approved: "approved, not started yet",
    parked: "parked",
};
export const PLANNED = ["building", "draft", "ready", "reviewing"];
export const PLAN_RUNNING = ["active", "waiting", "done", "approved"];
export const PLAN_STATES = {
    building: "Being planned",
    draft: "Being planned",
    ready: "Ready",
    reviewing: "Under review",
    approved: "Starting",
    active: "Being worked on",
    waiting: "Needs you",
    parked: "Paused",
    done: "Closed",
};

const openPlans = (plans) => plans.filter((p) => !p.completed && !p.deleted && p.data.status in PLAN_STATES).sort((a, b) => a.n - b.n);

export function leadingPlan(plans) {
    const open = openPlans(plans);
    const first = (...statuses) => open.find((p) => statuses.includes(p.data.status));
    return first("active", "waiting", "done") || first("approved") || first(...PLANNED) || first("parked") || null;
}

export function cardPlan(plans) {
    const lead = leadingPlan(plans.filter((plan) => !plan.data.dismissed));
    return lead && !PLAN_RUNNING.includes(lead.data.status) ? lead : null;
}

const BARS_SHOWN = 3;
const isRunning = (p) => PLAN_RUNNING.includes(p.data.status);

export function barPlans(plans) {
    const running = openPlans(plans)
        .filter(isRunning)
        .sort((a, b) => Boolean(a.data.delegated) - Boolean(b.data.delegated) || (a.data.status === "approved") - (b.data.status === "approved") || a.n - b.n);
    return running.length > BARS_SHOWN ? running.slice(0, BARS_SHOWN) : running;
}

export function otherPlans(plans) {
    const lead = leadingPlan(plans);
    return openPlans(plans).filter((p) => p !== lead);
}

export function foldedPlans(plans) {
    const shown = barPlans(plans);
    return openPlans(plans).filter((p) => !shown.includes(p));
}

export function othersLine(others) {
    const parked = others.filter((p) => p.data.status === "parked").length;
    const active = others.filter(isRunning).length;
    const planned = others.length - parked - active;
    const words = [
        active && `+${active} more active ${active === 1 ? "plan" : "plans"}`,
        planned && `+${planned} more planned`,
        parked && `${active || planned ? "" : "+"}${parked} paused`,
    ];
    return words.filter(Boolean).join(" · ");
}

const joined = (words) => (words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} and ${words.at(-1)}`);

export function withLine(helpers, tickets) {
    if (helpers.length) return `With ${helpers.length === 1 ? "helper" : "helpers"} ${joined(helpers)}`;
    if (tickets.length) return `With the agent on ${tickets.length === 1 ? "ticket" : "tickets"} ${joined(tickets)}`;
    return "With helpers";
}

export function delegationOf(p, {todos, helpers, worktrees, tickets}) {
    const phase = p.data.phases[(p.data.current || 1) - 1];
    if (!p.data.delegated || !phase) return null;
    const held = new Set(
        todos.filter((t) => phase.todos.includes(t.n) && !t.completed && String(t.data.assigned || "").startsWith("helper:")).map((t) => Number(t.data.assigned.split(":")[1]))
    );
    const found = helpers
        .filter((h) => held.has(h.n))
        .map((h) => ({
            n: h.n,
            name: h.data.name,
            job: h.title,
            branch: worktrees.filter((w) => !w.completed && w.data.helper === h.data.name).at(-1)?.data.branch || "",
        }));
    const agents = tickets.filter((t) => (phase.tickets || []).includes(t.n) && !t.completed).map((t) => t.n);
    return {helpers: found, tickets: agents, line: withLine(found.map((h) => h.name), agents)};
}

export function sizeOf(p) {
    const phases = p.data.phases.length;
    const rows = rowsOf(p).length;
    if (PLANNED.includes(p.data.status) && p.data.status !== "ready")
        return phases ? `${counted(phases, "phase")} so far` : "No phases yet";
    return `${counted(phases, "phase")} · ${counted(rows, "to-do")}`;
}

export function stoppedOf(p, todos) {
    return `Stopped at phase ${p.data.current || 1} · ${doneOf(p, todos)} of ${rowsOf(p).length} to-dos done`;
}

export function phaseOf(p) {
    const at = p.data.phases[(p.data.current || 1) - 1];
    return at ? at.title : "";
}

export function rowsOf(p) {
    return p.data.phases.flatMap((ph) => ph.todos);
}

export function doneOf(p, todos) {
    return rowsOf(p).filter((n) => (todos.find((t) => t.n === n) || {}).completed).length;
}

export function planButton(p) {
    if (p.completed) return null;
    return {ready: ["approve", "Approve"], reviewing: ["approve", "Approve"], waiting: ["continue", "Continue"], done: ["finish", "Close"]}[p.data.status] || null;
}
