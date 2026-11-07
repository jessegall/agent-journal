import {ASLEEP_AFTER, TOOL_STATES, clipOf} from "../domain/figureState.js";

// what a shell line says it does, as the chat's running line shows it: a test run, a build or a search; any other command is plain running
const SHELL_WORK = [[/\b\w*test\w*\b/i, "testing"], [/\bbuild\b/i, "building"], [/\b(grep|rg|find)\b|journal search/i, "searching"]];
const shellState = (line) => SHELL_WORK.find(([words]) => words.test(line))?.[1] ?? "running";

// What the figure holds, from what the chat reads: the state for the tool the agent last began, as the chat's running line says it ("Read
// src/a.py": the tool, then what it does); with none in hand it compacts or thinks while the agent does, waits on the user or a run, idles, and
// sleeps once no hook has been heard for two minutes. `facts` are {thinking, waitingFor, waitingSince, compacting}.
export function heldState(running, heardAt, now, {thinking = false, waitingFor = "", waitingSince = 0, compacting = false} = {}) {
    if (compacting) return "compacting";
    const [tool, ...line] = running.trim().split(/\s+/);
    if (tool) return tool === "Bash" ? shellState(line.join(" ")) : (TOOL_STATES[tool] ?? "running");
    if (thinking) return "thinking";
    const dozing = heardAt && now - heardAt >= ASLEEP_AFTER;
    if (waitingSince) return "asking";
    if (waitingFor) return dozing ? "asleep" : "waiting";
    return dozing ? "asleep" : "idle";
}

export const heldClip = (running, heardAt, now) => clipOf(heldState(running, heardAt, now));
