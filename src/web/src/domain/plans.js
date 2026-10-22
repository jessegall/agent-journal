import {counted} from "../format/number.js";
import {createdAt, isClosed} from "./row.js";

// A plan's standing: its state, or waiting while a started plan holds at a checkpoint for the user.
export const statusOf = (p) => (p.state === "started" && p.held ? "waiting" : p.state);

export const NOT_STARTED = {
    draft: "being written",
    ready: "waiting for your approval",
    approved: "approved, not started yet",
    parked: "parked",
};
export const PLANNED = ["draft", "ready", "reviewing"];
export const PLAN_RUNNING = ["started", "waiting", "blocked", "approved"];
export const PLAN_STATES = {
    draft: "Being planned",
    ready: "Ready",
    reviewing: "Under review",
    approved: "Starting",
    started: "Being worked on",
    waiting: "Needs you",
    parked: "Paused",
    blocked: "Blocked",
    done: "Closed",
};

const openPlans = (plans) => plans.filter((p) => !isClosed(p) && statusOf(p) in PLAN_STATES).sort((a, b) => a.id - b.id);

export const reviewersLine = (n) => (n ? `${n} ${n === 1 ? "reviewer" : "reviewers"} still reviewing` : "");

const roundWhen = (at) => new Date(at * 1000).toLocaleString(undefined, {day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"});

// A plan's review rounds, newest first as the server sends them, each numbered from the first and said in plain words.
export function reviewRounds(plan) {
    const rounds = plan.reviews || [];
    return rounds.map((review, i) => ({
        id: review.id,
        title: `Review round ${rounds.length - i}`,
        when: roundWhen(createdAt(review)),
        reviewers: review.reviewers.length ? counted(review.reviewers.length, "reviewer") : "",
        names: review.reviewers.join(", "),
        changed: review.changed ?? "Still in review",
        reports: review.report_ids,
    }));
}

export function leadingPlan(plans) {
    const open = openPlans(plans);
    const first = (...statuses) => open.find((p) => statuses.includes(statusOf(p)));
    return first("started", "waiting") || first("approved") || first(...PLANNED) || first("parked") || null;
}

export function cardPlan(plans) {
    return leadingPlan(plans.filter((plan) => !PLAN_RUNNING.includes(statusOf(plan))));
}

const MAX_BARS = 3;
const isRunning = (p) => PLAN_RUNNING.includes(statusOf(p));

export function barPlans(plans) {
    const running = openPlans(plans)
        .filter(isRunning)
        .sort((a, b) => Boolean(a.delegated) - Boolean(b.delegated) || (statusOf(a) === "approved") - (statusOf(b) === "approved") || a.id - b.id);
    return running.length > MAX_BARS ? running.slice(0, MAX_BARS) : running;
}

export function otherPlans(plans, shown) {
    return openPlans(plans).filter((p) => p.id !== shown.id);
}

export function foldedPlans(plans) {
    const barred = barPlans(plans);
    return openPlans(plans).filter((p) => !barred.includes(p));
}

export function othersLine(others) {
    const parked = others.filter((p) => statusOf(p) === "parked").length;
    const active = others.filter(isRunning).length;
    const planned = others.length - parked - active;
    const words = [
        active && `+${active} more active ${active === 1 ? "plan" : "plans"}`,
        planned && `+${planned} more planned`,
        parked && `${active || planned ? "" : "+"}${parked} paused`,
    ];
    return words.filter(Boolean).join(" · ");
}

// The phase in hand, counted from 1.
const phaseAt = (p) => (p.phases || [])[(p.current_phase || 1) - 1] || null;

// Who works on the phase in hand when the plan is delegated: the workers that hold its open tasks, named on the bar when there is
// one and said as Delegated when there are more, the list kept for the bar's popover.
export function delegationOf(p, {tasks, workers}) {
    const phase = phaseAt(p);
    if (!p.delegated || !phase) return null;
    const held = new Set(tasks.filter((t) => phase.task_ids.includes(t.id) && !isClosed(t) && t.worker_id).map((t) => t.worker_id));
    const found = workers.filter((w) => held.has(w.id)).map((w) => ({id: w.id, name: w.name, job: w.brief, branch: w.worktree}));
    return {workers: found, line: found.length === 1 ? `Worker: ${found[0].name}` : "Delegated"};
}

export function sizeOf(p) {
    const phases = (p.phases || []).length;
    if (PLANNED.includes(statusOf(p)) && statusOf(p) !== "ready") return phases ? `${counted(phases, "phase")} so far` : "No phases yet";
    return `${counted(phases, "phase")} · ${counted(rowsOf(p).length, "task")}`;
}

export function stoppedOf(p, tasks) {
    return `Stopped at phase ${p.current_phase || 1} · ${standingOf(p, tasks).title}`;
}

export function phaseOf(p) {
    return phaseAt(p)?.title || "";
}

export const rowsOf = (p) => p.task_ids || [];

// a plan's tasks finished as done; a task given up is closed but not done
function doneOf(p, tasks) {
    return rowsOf(p).filter((id) => tasks.find((t) => t.id === id)?.state === "done").length;
}

// How a plan's tasks stand: how many are done and how many there are, with the words and the bar's width.
export function standingOf(p, tasks) {
    const done = doneOf(p, tasks);
    const rows = rowsOf(p).length;
    return {done, waiting: 0, rows, donePart: (100 * done) / Math.max(1, rows), waitingPart: 0, title: `${done} of ${rows} tasks done`};
}

// The one button a plan's bar offers: approve one that is ready.
export function planButton(p) {
    return statusOf(p) === "ready" ? ["approve", "Approve"] : null;
}

export function planProgress(row) {
    if (row.table !== "plans") return null;
    const phases = row.phases || [];
    const current = row.current_phase || 1;
    const status = statusOf(row);
    return {total: phases.length, finished: status === "done" ? phases.length : Math.max(0, current - 1), phase: Math.min(current, phases.length) || 1, status};
}
