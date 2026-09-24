const REPORTED = ["stopped", "idle", "compacting"];

export function currentWork(works) {
    const open = works.filter((w) => !w.completed);
    return open.find((w) => !w.data.parked) || null;
}

export function parkedWork(works) {
    return works.filter((w) => !w.completed && w.data.parked);
}

export function waitsFor(works) {
    const awaiting = currentWork(works)?.data.awaiting;
    return awaiting ? `for ${awaiting}` : "";
}

export function stateOf(agent, works) {
    if (agent && agent.data.paused) return "paused";
    const reported = agent ? agent.data.status : "stopped";
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

const WORDS = {working: "Working", busy: "Busy", compacting: "Busy", paused: "Paused"};

export function wordOf(state) {
    return WORDS[state] || "Idle";
}

export function lineOf(agent, works, auto = false) {
    const state = stateOf(agent, works);
    if (state === "stopped") return "no agent is on this environment";
    if (state === "compacting") return "compacting its context — it carries on after";
    if (state === "waiting") return waitsFor(works);
    if (state === "paused") return "held until you resume it";
    const current = currentWork(works);
    if (current) return named(current);
    if (state === "idle") return phrase(auto ? "auto" : "idle", agent.data.at);
    return phrase("bearings", agent.data.at);
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

export function phrase(kind, seed) {
    const words = SAID[kind] || SAID.bearings;
    return words[Math.floor(Number(seed) || 0) % words.length];
}

export const NOT_STARTED = {
    building: "being written",
    draft: "a draft",
    ready: "waiting for your approval",
    approved: "approved, not started yet",
    parked: "parked",
};
export const PLANNED = ["building", "draft", "ready"];
export const RUNNING = ["active", "waiting", "done", "approved"];
export const PLAN_STATES = {
    building: "Being planned",
    draft: "Being planned",
    ready: "Ready",
    approved: "Starting",
    active: "Being worked on",
    waiting: "Waiting for you",
    parked: "Parked",
    done: "Finished",
};

const openPlans = (plans) => plans.filter((p) => !p.completed && !p.deleted && p.data.status in PLAN_STATES).sort((a, b) => a.n - b.n);

export function leadingPlan(plans) {
    const open = openPlans(plans);
    const first = (...statuses) => open.find((p) => statuses.includes(p.data.status));
    return first("active", "waiting", "done") || first("approved") || first(...PLANNED) || first("parked") || null;
}

export function cardPlan(plans) {
    const lead = leadingPlan(plans.filter((plan) => !plan.data.dismissed));
    return lead && !RUNNING.includes(lead.data.status) ? lead : null;
}

export function barPlan(plans) {
    const lead = leadingPlan(plans);
    return lead && RUNNING.includes(lead.data.status) ? lead : null;
}

export function otherPlans(plans) {
    const lead = leadingPlan(plans);
    return openPlans(plans).filter((p) => p !== lead);
}

export function othersLine(others) {
    const parked = others.filter((p) => p.data.status === "parked").length;
    const planned = others.length - parked;
    const words = [planned && `+${planned} more planned`, parked && `${planned ? "" : "+"}${parked} parked`];
    return words.filter(Boolean).join(" · ");
}

export function sizeOf(p) {
    const phases = p.data.phases.length;
    const rows = rowsOf(p).length;
    if (PLANNED.includes(p.data.status) && p.data.status !== "ready") {
        return phases ? `${phases} phase${phases === 1 ? "" : "s"} so far` : "No phases yet";
    }
    return `${phases} phase${phases === 1 ? "" : "s"} · ${rows} to-do${rows === 1 ? "" : "s"}`;
}

export function stoppedOf(p, todos) {
    return `Stopped at phase ${p.data.current || 1} · ${doneOf(p, todos)} of ${rowsOf(p).length} to-dos done`;
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
    if (p.completed) return null;
    return {ready: ["approve", "Approve"], waiting: ["continue", "Continue"], done: ["finish", "Finish"]}[p.data.status] || null;
}
