export const NOT_STARTED = {
    draft: "being written",
    ready: "waiting for your approval",
    approved: "approved, not started yet",
    paused: "paused",
};
export const PLANNED = ["draft", "ready"];
export const PLAN_RUNNING = ["started", "waiting", "delegated", "blocked", "approved"];

export const PLAN_STATES = {
    draft: "Being planned",
    ready: "Ready",
    approved: "Starting",
    started: "Work: in progress",
    waiting: "Approval: needed",
    paused: "Paused",
    delegated: "With agents",
    blocked: "Blocked",
    done: "Closed",
};

// the agents queued for or holding the open tasks of a plan, each named once
export const agentNames = (plan) => [...new Set(plan.agents.map((agent) => agent.name))];

// the plan bar's button: the agent's name when one agent has the plan, Delegated when several do
export const delegationWord = (plan) => (agentNames(plan).length === 1 ? `Worker: ${agentNames(plan)[0]}` : "Delegated");

