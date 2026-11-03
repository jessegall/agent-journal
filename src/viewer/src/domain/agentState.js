import {ago} from "../format/time.js";
import {seconds} from "./row.js";

export const SILENT = "silent";

export const SILENT_WORD = "Not responding";

const REPORTED = ["stopped", "idle", "compacting"];

// Seconds after its last hook with no tool running that an agent that awaits something is shown as waiting again.
export const WAITING_AGAIN_AFTER = 3;

const quietSince = (agent, now) => !agent.tool_running && seconds(agent.heard_at) > 0 && now - seconds(agent.heard_at) >= WAITING_AGAIN_AFTER;

export function stateOf(agent, now = Date.now() / 1000) {
    if (agent?.state === "paused") return "paused";
    const reported = agent ? agent.status : "stopped";
    if (agent?.awaiting && ["working", "busy"].includes(reported) && quietSince(agent, now)) return "waiting";
    if (reported === "working") return "working";
    if (reported === "idle" && agent.awaiting) return "waiting";
    return REPORTED.includes(reported) ? reported : agent.awaiting ? "waiting" : "busy";
}

const ENDINGS = {
    completed: {word: "Done", dot: "done"},
    returned: {word: "Done", dot: "done"},
    failed: {word: "Failed", dot: "failed"},
    refused: {word: "Refused", dot: "failed"},
    stopped: {word: "Stopped", dot: ""},
    killed: {word: "Stopped", dot: ""},
};

// the dot and words an agent's run that has ended is shown by: how it ended, and when
export function ending(status, at) {
    const ended = ENDINGS[status] || ENDINGS.completed;
    return {dot: ended.dot, word: at ? `${ended.word} ${ago(at)}` : ended.word};
}

export const named = (task) => `task ${task.id} · ${task.title}`;

// Whether auto would take up a task now: an open one that is not blocked, held by a worker or asked about.
export function queued(tasks, auto) {
    return auto && tasks.some((t) => t.state === "open" && !t.worker_id);
}


