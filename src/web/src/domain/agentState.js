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
    if (state === "compacting") return "compacting its context — it carries on after";
    if (state === "waiting") return waitsFor(works) || `on its run: ${backgroundRun(agent)}`;
    if (state === "paused") return "held until you resume it";
    const current = currentWork(works);
    if (current) return named(current);
    if (state === "idle") return phrase(auto ? "auto" : "idle", agent.data.at);
    return phrase("bearings", agent.data.at);
}

const PHRASES = {
    auto: [
        "for instructions",
        "for the next row",
        "for the engine's word",
        "for the list to speak",
        "between one row and the next",
        "for the next to-do",
        "for its next orders",
        "for the queue",
        "for the next thing",
        "for the go-ahead",
    ],
    idle: [
        "waiting for you",
        "taking a breath",
        "all ears",
        "resting between rounds",
        "nothing on its desk",
        "standing by",
        "ready when you are",
        "kettle on, waiting",
        "hands folded, listening",
        "at your service",
    ],
    bearings: [
        "finding its bearings",
        "looking around",
        "thinking",
        "getting oriented",
        "working out what is next",
        "taking stock",
        "considering",
        "mulling it over",
        "reading the room",
        "gathering its thoughts",
    ],
};

export function phrase(kind, seed) {
    const words = PHRASES[kind] || PHRASES.bearings;
    return words[Math.floor(Number(seed) || 0) % words.length];
}
