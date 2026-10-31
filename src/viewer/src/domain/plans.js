import {counted} from "../format/number.js";
import {createdAt, isClosed} from "./row.js";

// A plan's standing: its state, or waiting while a started plan holds at a checkpoint for the user.
export const statusOf = (p) => (p.state === "started" && p.held ? "waiting" : p.state);

export const NOT_STARTED = {
    draft: "being written",
    ready: "waiting for your approval",
    approved: "approved, not started yet",
    paused: "paused",
};
export const PLANNED = ["draft", "ready", "reviewing"];
export const PLAN_RUNNING = ["started", "waiting", "delegated", "blocked", "approved"];

// The plan the agent is working: a builder or a solo agent has one, an orchestrator may have several.
export const isActivePlan = (p) => p.state === "started";
export const PLAN_STATES = {
    draft: "Being planned",
    ready: "Ready",
    reviewing: "Under review",
    approved: "Starting",
    started: "Being worked on",
    waiting: "Needs you",
    paused: "Paused",
    delegated: "With workers",
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
    return first("started", "waiting") || first("approved") || first(...PLANNED) || first("paused") || null;
}

export function cardPlan(plans, chosen = 0) {
    const waiting = plans.filter((plan) => !PLAN_RUNNING.includes(statusOf(plan)) && !plan.is_dismissed);
    return openPlans(waiting).find((plan) => plan.id === chosen) || leadingPlan(waiting);
}

// the other plans the plan card can show instead of the one it shows: those not yet approved
export function cardChoices(plans, shown) {
    return openPlans(plans).filter((plan) => plan.id !== shown.id && PLANNED.includes(statusOf(plan)) && !plan.is_dismissed);
}

const isRunning = (p) => PLAN_RUNNING.includes(statusOf(p));

// The tone a plan's state is drawn in on the Plans window, by its state
const TONES = {delegated: "workers", started: "working", waiting: "asks", blocked: "blocked", ready: "ready", approved: "ready", paused: "paused", reviewing: "review", draft: "review"};
export const planTone = (p) => TONES[statusOf(p)] || "working";

// Why a plan being worked on stands where it does, shown after its state: a block's reason, or the checkpoint it waits at
const REASONS = {blocked: (p) => p.block_reason || "", waiting: () => "Stopped at a checkpoint for you to check it"};
export const planReason = (p) => (REASONS[statusOf(p)] || (() => ""))(p);

// A plan waiting to start, as its row names its state
export const waitingLabel = (p) => (statusOf(p) === "ready" ? `${PLAN_STATES.ready}, ${NOT_STARTED.ready}` : PLAN_STATES[statusOf(p)]);

// The Plans window's groups of open plans: those being worked on, then those waiting to start or paused.
export function planGroups(plans) {
    const open = openPlans(plans);
    return [
        {key: "running", title: "Being worked on", plans: open.filter(isRunning)},
        {key: "waiting", title: "Waiting to start", plans: open.filter((p) => !isRunning(p))},
    ].filter((group) => group.plans.length);
}





// A plan list row carries the plan alone; its phases and their task ids are read from a plan held whole.
export const isWholePlan = (p) => "task_ids" in p;
export const wholePhases = (p) => (isWholePlan(p) ? p.phases || [] : []);

// The phase in hand, counted from 1.
const phaseAt = (p) => wholePhases(p)[(p.current_phase || 1) - 1] || null;

// Who works on the phase in hand when the plan is delegated: the workers that hold its open tasks, named on the bar when there is
// one and said as Delegated when there are more, the list kept for the bar's popover.
export function delegationOf(p, {tasks, workers}) {
    const phase = phaseAt(p);
    if (!p.delegated || !phase) return null;
    const found = workersHolding(phase.task_ids, {tasks, workers});
    return {workers: found, line: found.length === 1 ? `Worker: ${found[0].name}` : "Delegated"};
}

// The workers that hold an open task among these, each with the job it was given and the task it holds.
export function workersHolding(taskIds, {tasks, workers}) {
    const held = new Map(tasks.filter((t) => taskIds.includes(t.id) && !isClosed(t) && t.worker_id).map((t) => [t.worker_id, t]));
    return workers.filter((w) => held.has(w.id)).map((w) => ({id: w.id, name: w.name, job: w.brief, branch: w.worktree, task: `${held.get(w.id).id} ${held.get(w.id).title}`}));
}

export function sizeOf(p) {
    const phases = phaseCount(p);
    if (PLANNED.includes(statusOf(p)) && statusOf(p) !== "ready") return phases ? `${counted(phases, "phase")} so far` : "No phases yet";
    return `${counted(phases, "phase")} · ${counted(taskCount(p), "task")}`;
}

export function stoppedOf(p, tasks) {
    return `Stopped at phase ${p.current_phase || 1} · ${standingOf(p, tasks).title}`;
}

export function phaseOf(p) {
    return phaseAt(p)?.title || "";
}

export const rowsOf = (p) => p.task_ids || [];

// A plan row from the list carries the counts alone; one read whole carries the phases and tasks themselves.
export const phaseCount = (p) => p.phase_count ?? wholePhases(p).length;
export const taskCount = (p) => p.task_count ?? rowsOf(p).length;

// a plan's tasks finished as done; a task given up is closed but not done
function doneOf(p, tasks) {
    return rowsOf(p).filter((id) => tasks.find((t) => t.id === id)?.state === "completed").length;
}

// How a plan's tasks stand: how many are done and how many there are, with the words and the bar's width.
export function standingOf(p, tasks) {
    const done = doneOf(p, tasks);
    const rows = taskCount(p);
    return {done, waiting: 0, rows, donePart: (100 * done) / Math.max(1, rows), waitingPart: 0, title: `${done} of ${rows} tasks done`};
}

// The one button a plan's bar offers: approve one that is ready.
export function planButton(p) {
    return statusOf(p) === "ready" ? ["approve", "Approve"] : null;
}

export function planProgress(row) {
    if (row.table !== "plans") return null;
    const total = phaseCount(row);
    const current = row.current_phase || 1;
    const status = statusOf(row);
    return {total, finished: status === "done" ? total : Math.max(0, current - 1), phase: Math.min(current, total) || 1, status};
}
