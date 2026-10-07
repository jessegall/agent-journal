import {helperEnvironment, helperName, helperState} from "./helpers.js";

export const SILENT = "silent";

export const SILENT_WORD = "Not responding";

const REPORTED = ["stopped", "idle", "compacting"];

export function currentWork(works) {
    const open = works.filter((w) => !w.completed);
    return open.find((w) => !w.data.parked) || null;
}

export function waitsFor(works) {
    const awaiting = currentWork(works)?.data.awaiting;
    return awaiting ? `for ${awaiting}` : "";
}

const RUN_KINDS = ["shell_rows", "subagent_rows", "monitor_rows"];

export function backgroundRun(agent) {
    if (!agent) return "";
    if (agent.data.background_run !== undefined) return agent.data.background_run;
    const running = RUN_KINDS.flatMap((kind) => agent.data[kind] || []).find((entry) => entry.running);
    return running ? running.task || running.command || "a background run" : "";
}

const HELPER = "helper:";
const BACK = ["reported", "finished"];
const countOf = (n) => `${n} ${n === 1 ? "helper" : "helpers"}`;

const minutes = (since, now) => {
    const m = Math.max(1, Math.floor((now - since) / 60));
    return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h`;
};

function runItem(runs, ref, text) {
    const run = runs.find((entry) => [entry.task_id, entry.id].includes(ref));
    return {label: run?.task || run?.command || text, where: "a background run", reported: Boolean(run) && !run.running};
}

function helperItem(helpers, ref) {
    const row = helpers.find((h) => `${HELPER}${h.n}` === ref);
    if (!row) return {label: ref, where: "", reported: false};
    return {label: helperName(row), where: helperEnvironment(row) || "", since: Number(row.created || 0), reported: BACK.includes(helperState(row))};
}

export function waitingFor({text, on, since}, {runs = [], helpers = [], now = Date.now() / 1000} = {}) {
    if (!text) return null;
    const refs = String(on || "").split(",").filter(Boolean);
    const items = refs.length
        ? refs.map((ref) => (ref.startsWith(HELPER) ? helperItem(helpers, ref) : runItem(runs, ref, text)))
        : [{label: text, where: "", reported: false}];
    const helping = refs.length > 0 && refs.every((ref) => ref.startsWith(HELPER));
    const out = items.filter((item) => !item.reported).length;
    return {text, items, helping, since, line: `on ${helping ? countOf(out || items.length) : text}${since ? ` · ${minutes(since, now)}` : ""}`};
}

export function waitingOn(agent, works, helpers = [], now = Date.now() / 1000) {
    const work = currentWork(works);
    const runs = RUN_KINDS.flatMap((kind) => agent?.data[kind] || []);
    const text = work?.data.awaiting || backgroundRun(agent);
    return waitingFor({text, on: work?.data.awaiting_on, since: Number(work?.data.awaiting_since || 0)}, {runs, helpers, now});
}

export function stateOf(agent, works) {
    if (agent && agent.data.paused) return "paused";
    const reported = agent ? agent.data.status : "stopped";
    if (reported === "idle" && (backgroundRun(agent) || waitsFor(works))) return "waiting";
    return REPORTED.includes(reported) ? reported : waitsFor(works) ? "waiting" : currentWork(works) ? "working" : "busy";
}

export function named(w) {
    return w.data.todo ? `to-do ${w.data.todo} · ${w.title}` : w.title;
}

export function queued(todos, auto, questions = []) {
    const open = todos.filter((t) => !t.completed && !t.deleted);
    const asked = (t) => questions.some((q) => !q.completed && !q.deleted && q.refs.includes(`todo:${t.n}`));
    const waits = (t) => [].concat(t.data.after || []).some((ref) => open.some((o) => `todo:${o.n}` === ref));
    return auto && open.some((t) => !t.data.blocked && !t.data.assigned && !asked(t) && !waits(t));
}

const WORDS = {working: "Working", waiting: "Waiting", busy: "Busy", compacting: "Busy", paused: "Paused", [SILENT]: SILENT_WORD};

export function wordOf(state) {
    return WORDS[state] || "Idle";
}

export function lineOf(agent, works, auto = false, helpers = []) {
    const state = stateOf(agent, works);
    if (state === "stopped") return "no agent is on this environment";
    if (state === "compacting") return "summarizing the conversation, then it carries on";
    if (state === "waiting") return waitingOn(agent, works, helpers)?.line || "on a background run";
    if (state === "paused") return "held until you resume it";
    const current = currentWork(works);
    if (current) return named(current);
    if (state === "idle") return phrase(auto ? "auto" : "idle");
    return phrase("bearings");
}

const PHRASES = {
    auto: "ready for the next to-do",
    idle: "ready for your next message",
    bearings: "starting up",
};

export function phrase(kind) {
    return PHRASES[kind] || PHRASES.bearings;
}
