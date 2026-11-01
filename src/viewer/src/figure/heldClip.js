import {ASLEEP_AFTER, TOOL_STATES, clipOf} from "../domain/figureState.js";

// What the figure holds while the agent does nothing but work: the clip for the tool the agent last began, as the chat's running line says it
// ("Read src/a.py": the tool, then what it does), idle between tools, and asleep once no hook has been heard for two minutes.
export function heldState(running, heardAt, now) {
    const tool = running.trim().split(/\s+/)[0] ?? "";
    if (tool) return TOOL_STATES[tool] ?? "running";
    return heardAt && now - heardAt >= ASLEEP_AFTER ? "asleep" : "idle";
}

export const heldClip = (running, heardAt, now) => clipOf(heldState(running, heardAt, now));
