import {wordLabel} from "@journal/window-kit";

const NUDGE_TYPES = {info: "Notice", steering: "Instruction", refusal: "Refusal"};
const HOOK_EVENTS = {
    pre_tool_use: "Before a tool runs",
    post_tool_use: "After a tool runs",
    post_tool_use_failure: "Tool failed",
    prompt: "Prompt submitted",
    stop: "Agent stopping",
    stop_failure: "Agent failed",
    session_start: "Session started",
    session_end: "Session ended",
    compact: "Context shortened",
    message_display: "Message shown",
    tick: "Timer",
};

export const nudgeTypeLabel = (type) => NUDGE_TYPES[type] ?? wordLabel(type);
export const hookEventLabel = (hook) => HOOK_EVENTS[hook] ?? wordLabel(hook);
