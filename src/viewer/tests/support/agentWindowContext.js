import {context as baseContext} from "./windowContext.js";
import {AGENT_EDIT_KEYS} from "./fileFeedWindowContext.js";
import {AGENT_TERMINAL_KEYS} from "./terminalWindowContext.js";

export {mounted, page, pickButton, settle, settleTransition, typeInto} from "./windowContext.js";

export const AGENT_KEYS = {
    ...AGENT_EDIT_KEYS,
    ...AGENT_TERMINAL_KEYS,
    reports: {line: "message agent-reports", tab: "reports", events: ["message.*"]},
    agents: {line: "agent cards", events: ["agent.*", "task.*", "hook_call.*"]},
    "card.*": {line: "agent cards --show all --include-main --id {id}", events: ["agent.*", "task.*", "hook_call.*"]},
    "count-agents": {line: "agent cards --show all --reusable", arguments: ["role", "profile", "page"], loading: "requested", events: ["agent.*", "task.*", "hook_call.*"]},
    filters: {line: "agent cards --options", events: ["agent.*"]},
    programs: {line: "agent programs", events: []},
    limits: {line: "agent limits", events: ["agent.*", "setting.*"]},
    tool: {line: "usage tool", events: [], loading: "requested"},
    "transcript.*": {line: "agent transcript {id}", events: [], page_size: 50},
    jobs: {line: "task list --state open --limit 100", events: [], loading: "requested"},
    waits: {line: "worker waits", events: ["agent.*", "task.*", "proof.*", "worker_worktree.*"]},
    progress: {line: "worker progress", events: ["task.*", "worker_worktree.*"]},
};

export const context = (answers, agent = null) => baseContext(answers, agent, AGENT_KEYS);
