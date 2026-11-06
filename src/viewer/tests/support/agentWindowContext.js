import {context as baseContext} from "./windowContext.js";

export {mounted, page, pickButton, settle, settleTransition, typeInto} from "./windowContext.js";

export const AGENT_KEYS = {
    reports: {line: "message agent-reports", tab: "reports", events: ["message.*"]},
    agents: {line: "agent cards", events: ["agent.*", "task.*", "hook_call.*"]},
    filters: {line: "agent cards --options", events: ["agent.*"]},
    programs: {line: "agent programs", events: []},
    limits: {line: "agent limits", events: ["agent.*", "setting.*"]},
    tool: {line: "usage tool", events: [], loading: "requested"},
    "transcript.*": {line: "agent transcript {id}", events: []},
    jobs: {line: "task list --state open --limit 100", events: [], loading: "requested"},
    waits: {line: "worker waits", events: ["agent.*", "task.*", "proof.*", "worker_worktree.*"]},
    progress: {line: "worker progress", events: ["task.*", "worker_worktree.*"]},
};

export const context = (answers, agent = null) => baseContext(answers, agent, AGENT_KEYS);
