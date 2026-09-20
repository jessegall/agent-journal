const REPORTED = ["stopped", "idle", "compacting"];

export function currentWork(works) {
    const open = works.filter((w) => !w.completed);
    return open.find((w) => !w.data.parked) || null;
}

export function parkedWork(works) {
    return works.filter((w) => !w.completed && w.data.parked);
}

export function stateOf(agent, works) {
    const reported = agent ? agent.data.status : "stopped";
    return REPORTED.includes(reported) ? reported : currentWork(works) ? "working" : "busy";
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

export function wordOf(state, waiting = false) {
    return capital(state === "idle" && waiting ? "waiting" : state);
}

export function lineOf(agent, works, auto = false, doing = "") {
    const state = stateOf(agent, works);
    if (state === "stopped") return "no agent is on this environment";
    if (state === "compacting") return "compacting its context — it carries on after";
    const current = currentWork(works);
    if (current) return named(current);
    if (state === "idle") return said(auto ? "auto" : "idle", agent.data.at);
    return doing || said("bearings", agent.data.at);
}

const SAID = {
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

export function said(kind, seed) {
    const words = SAID[kind] || SAID.bearings;
    return words[Math.floor(Number(seed) || 0) % words.length];
}

export function capital(word) {
    return word[0].toUpperCase() + word.slice(1);
}

export const SHOWN = ["ready", "active", "waiting", "done"];

export function shownPlans(plans) {
    return plans.filter((p) => SHOWN.includes(p.data.status) && !p.completed);
}

export function phaseOf(p) {
    const at = p.data.phases[(p.data.current || 1) - 1];
    return at ? at.title : "";
}

export function rowsOf(p) {
    return p.data.phases.flatMap((ph) => ph.todos);
}

export function doneOf(p, todos) {
    return rowsOf(p).filter((n) => (todos.find((t) => t.n === n) || {}).completed).length;
}

export function planButton(p) {
    return {ready: ["activate", "Start"], waiting: ["continue", "Continue"], done: ["acknowledge", "Acknowledge"]}[p.data.status] || null;
}
