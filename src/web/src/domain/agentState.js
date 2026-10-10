import {elapsed} from "../format/time.js";
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

const RUN_KINDS = {shell_rows: "command", subagent_rows: "subagent", monitor_rows: "background run"};
const RUN_ROWS = Object.keys(RUN_KINDS);

export function backgroundRun(agent) {
    if (!agent) return "";
    if (agent.data.background_run !== undefined) return agent.data.background_run;
    const running = RUN_ROWS.flatMap((kind) => agent.data[kind] || []).find((entry) => entry.running);
    return running ? running.task || running.command || "a background run" : "";
}

const HELPER = "helper:";
const STATUS_WORDS = {command: "Running", subagent: "Working", helper: "At work", question: "Waiting on you"};
const statusOf = (item) => (item.reported ? "Report ready" : STATUS_WORDS[item.kind] || "At work");
const BACK = ["reported", "finished"];
const countOf = (n) => `${n} ${n === 1 ? "helper" : "helpers"}`;

function runItem(runs, ref, text) {
    const run = runs.find((entry) => [entry.task_id, entry.id].includes(ref));
    return {label: run?.task || run?.command || text, where: "", kind: run?.kind || "background run", reported: !run || !run.running, ended: Number(run?.ended || 0)};
}

function helperItem(helpers, ref) {
    const row = helpers.find((h) => `${HELPER}${h.n}` === ref);
    if (!row) return {label: ref, where: "", kind: "helper", reported: false};
    return {label: helperName(row), where: helperEnvironment(row) || "", kind: "helper", since: Number(row.created || 0), reported: BACK.includes(helperState(row))};
}

export function waitingFor({text, on, since}, {runs = [], helpers = [], now = Date.now() / 1000} = {}) {
    if (!text) return null;
    const refs = String(on || "").split(",").filter(Boolean);
    const items = refs.length
        ? refs.map((ref) => (ref.startsWith(HELPER) ? helperItem(helpers, ref) : runItem(runs, ref, text)))
        : [{label: text, where: "", kind: "", reported: false}];
    items.forEach((item) => {
        const began = item.since || since;
        const stop = item.reported && item.ended ? item.ended : now;
        item.out = began ? elapsed(stop - began) : "";
        item.status = statusOf(item);
    });
    const helping = refs.length > 0 && refs.every((ref) => ref.startsWith(HELPER));
    const out = items.filter((item) => !item.reported).length;
    const kinds = [...new Set(items.map((item) => item.kind))];
    return {text, items, helping, kind: kinds.length === 1 ? kinds[0] : "", since, line: `${helping ? countOf(out || items.length) : text}${since ? ` · ${elapsed(now - since)}` : ""}`};
}

export function waitingOn(agent, works, helpers = [], now = Date.now() / 1000) {
    const work = currentWork(works);
    const runs = RUN_ROWS.flatMap((kind) => (agent?.data[kind] || []).map((entry) => ({...entry, kind: RUN_KINDS[kind]})));
    const text = work?.data.awaiting || backgroundRun(agent);
    return waitingFor({text, on: work?.data.awaiting_on, since: Number(work?.data.awaiting_since || 0)}, {runs, helpers, now});
}

const running = (agent) => Boolean(agent && agent.data.running && agent.data.running.command && !agent.data.running.done);

export function stateOf(agent, works) {
    if (agent && agent.data.paused) return "paused";
    const reported = agent ? agent.data.status : "stopped";
    if (reported === "working" && running(agent)) return "working";
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

export function lineOf(agent, works, auto = false, helpers = [], helping = 0) {
    const state = stateOf(agent, works);
    if (state === "stopped") return "no agent is on this environment";
    if (state === "compacting") return "summarizing the conversation, then it carries on";
    if (state === "waiting") return waitingOn(agent, works, helpers)?.line || "a background run";
    if (state === "paused") return "held until you resume it";
    const current = currentWork(works);
    if (current) return named(current);
    if (state === "idle" && helping) return `Helpers: ${helping}`;
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
