import {isClosed} from "./row.js";

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

const isRunning = (p) => PLAN_RUNNING.includes(statusOf(p));

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
// The workers that hold an open task among these, each with the job it was given and the task it holds.
export function workersHolding(taskIds, {tasks, workers}) {
    const held = new Map(tasks.filter((t) => taskIds.includes(t.id) && !isClosed(t) && t.worker_id).map((t) => [t.worker_id, t]));
    return workers.filter((w) => held.has(w.id)).map((w) => ({id: w.id, name: w.name, job: w.brief, branch: w.worktree, task: `${held.get(w.id).id} ${held.get(w.id).title}`}));
}

export const rowsOf = (p) => p.task_ids || [];

export const taskCount = (p) => p.task_count ?? rowsOf(p).length;

