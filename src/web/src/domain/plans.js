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
    waiting: "Waiting for you",
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

export function barPlan(plans) {
    const lead = leadingPlan(plans);
    return lead && PLAN_RUNNING.includes(lead.data.status) ? lead : null;
}

export function otherPlans(plans) {
    const lead = leadingPlan(plans);
    return openPlans(plans).filter((p) => p !== lead);
}

export function othersLine(others) {
    const parked = others.filter((p) => p.data.status === "parked").length;
    const planned = others.length - parked;
    const words = [planned && `+${planned} more planned`, parked && `${planned ? "" : "+"}${parked} paused`];
    return words.filter(Boolean).join(" · ");
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
    return {ready: ["approve", "Approve"], waiting: ["continue", "Continue"], done: ["finish", "Close"]}[p.data.status] || null;
}
