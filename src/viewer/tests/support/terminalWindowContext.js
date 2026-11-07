import {context} from "./windowContext.js";

export const AGENT_TERMINAL_KEYS = {
    "terminal-calls.*": {line: "hook-call feed --session-agent-id {id}", page_size: 200},
    "terminal-output.*": {line: "output hook-page {id}"},
};

export const terminalWindowContext = (answers, agent) => context(answers, agent, {
    calls: {line: "hook-call feed", events: ["hook_call.*"], page_size: 200},
    "terminal-output.*": AGENT_TERMINAL_KEYS["terminal-output.*"],
});
