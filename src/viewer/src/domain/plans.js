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
    started: "Work: in progress",
    waiting: "Approval: needed",
    paused: "Paused",
    delegated: "Workers: active",
    blocked: "Blocked",
    done: "Closed",
};

// A plan list row carries the plan alone; its phases and their task ids are read from a plan held whole.
export const isWholePlan = (p) => "task_ids" in p;
