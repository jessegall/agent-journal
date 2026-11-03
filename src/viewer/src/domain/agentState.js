import {busyWording} from "./busyWording.js";
import {ago, elapsed} from "../format/time.js";
import {seconds} from "./row.js";
import {WORKER_WORDS, workerName, workerState} from "./workers.js";

export const SILENT = "silent";

export const SILENT_WORD = "Not responding";

const REPORTED = ["stopped", "idle", "compacting"];

const WORKER = "workers:";
const STATUS_PREFIXES = {worker: "At work", question: "Waiting on you"};
const statusOf = (item) => (item.reported ? WORKER_WORDS.reported : STATUS_PREFIXES[item.kind] || "At work");
const countOf = (n) => `${n} ${n === 1 ? "worker" : "workers"}`;

function workerItem(workers, ref) {
    const row = workers.find((w) => `${WORKER}${w.id}` === ref);
    if (!row) return {label: ref, kind: "worker", reported: false};
    return {label: workerName(row), kind: "worker", since: seconds(row.created_at), reported: workerState(row) !== "running"};
}

// What the agent waits for, item by item: the workers it named, or the one thing it said.
export function waitingFor({text, on, since}, {workers = [], now = Date.now() / 1000} = {}) {
    if (!text) return null;
    const refs = String(on || "")
        .split(",")
        .filter(Boolean);
    const items = refs.length ? refs.map((ref) => (ref.startsWith(WORKER) ? workerItem(workers, ref) : {label: text, kind: ref.split(":")[0], reported: false})) : [{label: text, kind: "", reported: false}];
    items.forEach((item) => {
        const began = item.since || since;
        item.out = began ? elapsed(now - began) : "";
        item.status = statusOf(item);
    });
    const working = refs.length > 0 && refs.every((ref) => ref.startsWith(WORKER));
    const out = items.filter((item) => !item.reported).length;
    const kinds = [...new Set(items.map((item) => item.kind))];
    const label = working ? countOf(out || items.length) : text;
    return {text, items, working, kind: kinds.length === 1 ? kinds[0] : "", since, label, line: `${label}${since ? ` · ${elapsed(now - since)}` : ""}`};
}

function waitingOn(agent, workers = [], now = Date.now() / 1000) {
    if (!agent?.awaiting) return null;
    return waitingFor({text: agent.awaiting, on: agent.wait_refs, since: seconds(agent.awaiting_since)}, {workers, now});
}

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

// The title of a state pushed over the agent's floor, such as Choosing paused work, which the bar names while the agent is idle in it.
const pushedTitle = (agent) => ((agent.stack || []).length > 1 && agent.state_title ? agent.state_title.toLowerCase() : "");

export function lineOf(agent, task, auto = false, workers = []) {
    const state = stateOf(agent);
    if (state === "stopped") return "no agent is on this environment";
    if (state === "compacting") return "compacting the conversation, then it carries on";
    if (state === "waiting") return waitingOn(agent, workers)?.label || "something it has not named";
    if (task) return named(task);
    if (state === "idle" && pushedTitle(agent)) return pushedTitle(agent);
    if (state === "idle") return phrase(auto ? "auto" : "idle");
    return ["working", "busy"].includes(state) ? busyWording(agent) : phrase("bearings");
}

const PHRASES = {
    auto: "ready for the next task",
    idle: "ready for your next message",
    bearings: "starting up",
};

export function phrase(kind) {
    return PHRASES[kind] || PHRASES.bearings;
}

