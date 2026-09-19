const REPORTED = ["stopped", "idle", "compacting"];

export function currentWork(works) {
    return works.find((w) => !w.completed) || null;
}

export function stateOf(agent, works) {
    const reported = agent ? agent.data.status : "stopped";
    return REPORTED.includes(reported) ? reported : currentWork(works) ? "working" : "busy";
}

export function named(w) {
    return w.data.todo ? `to-do ${w.data.todo} · ${w.title}` : w.title;
}

export function lineOf(agent, works) {
    const state = stateOf(agent, works);
    if (state === "stopped") return "no agent is on this environment";
    if (state === "compacting") return "compacting its context — it carries on after";
    const current = currentWork(works);
    if (current) return named(current);
    const last = works[works.length - 1];
    if (state === "idle") return last ? `last on ${named(last)}` : "waiting for you";
    const running = agent.data.running;
    return running && running.what && !running.done ? running.what : "finding its bearings";
}

export function capital(word) {
    return word[0].toUpperCase() + word.slice(1);
}

export const SHOWN = ["ready", "active", "waiting", "done"];

export function shownPlans(plans) {
    return plans.filter((p) => SHOWN.includes(p.data.status) && !p.completed);
}

export function phaseOf(p) {
    const i = p.data.current || 1;
    return p.data.phases[i - 1] ? `phase ${i}, ${p.data.phases[i - 1].title}` : "";
}

export function doneOf(p, todos) {
    return p.data.phases.filter((ph) => ph.todos.length && ph.todos.every((n) => (todos.find((t) => t.n === n) || {}).completed)).length;
}

export function planButton(p) {
    return {ready: ["activate", "Start"], waiting: ["continue", "Continue"], done: ["acknowledge", "Acknowledge"]}[p.data.status] || null;
}
