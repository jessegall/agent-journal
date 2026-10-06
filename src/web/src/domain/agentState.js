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

const WORDS = {working: "Working", busy: "Busy", compacting: "Busy", paused: "Paused", [SILENT]: SILENT_WORD};

export function wordOf(state) {
    return WORDS[state] || "Idle";
}

export function lineOf(agent, works, auto = false) {
    const state = stateOf(agent, works);
    if (state === "stopped") return "no agent is on this environment";
    if (state === "compacting") return "summarizing the conversation, then it carries on";
    if (state === "waiting") return waitsFor(works) || `on its run: ${backgroundRun(agent)}`;
    if (state === "paused") return "held until you resume it";
    const current = currentWork(works);
    if (current) return named(current);
    if (state === "idle") return phrase(auto ? "auto" : "idle");
    return phrase("bearings");
}

const PHRASES = {
    auto: "waiting for the next to-do",
    idle: "waiting for you",
    bearings: "starting up",
};

export function phrase(kind) {
    return PHRASES[kind] || PHRASES.bearings;
}
