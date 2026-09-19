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
    return running && running.what && !running.done ? doingOf(running) : "finding its bearings";
}

const DOING = [
    [/^journal (message|comment|reaction|question)\b/, "going through its inbox"],
    [/^journal\b/, "keeping the journal"],
    [/\b(pytest|python3? (-m )?tests?\/|npm test|vitest|jest|phpunit)\b/, "running tests"],
    [/\b(npm run build|vite build|make\b|cargo build|go build|tsc\b)/, "building"],
    [/^git (commit|push|add)\b/, "committing"],
    [/^git\b/, "looking at the history"],
    [/^(grep|rg|ag|find|ls|cat|sed -n|head|tail|wc|tree|fd)\b/, "looking through the code"],
    [/^(python3?|node|php|ruby|perl|bash|sh)\b/, "running a script"],
    [/^(curl|wget|http)\b/, "talking to a service"],
];

const TOOLS = {
    Read: "reading the code",
    Edit: "editing the code",
    MultiEdit: "editing the code",
    NotebookEdit: "editing the code",
    Write: "writing a file",
    Grep: "searching the code",
    Glob: "searching the code",
    WebFetch: "reading the web",
    WebSearch: "searching the web",
    Agent: "briefing a helper",
    Task: "briefing a helper",
    Skill: "loading a skill",
    TodoWrite: "sorting its own list",
};

export function doingOf(running) {
    const tool = running.tool || "Bash";
    if (tool === "Bash") return (DOING.find(([re]) => re.test(running.what.trim())) || [null, "running a command"])[1];
    if (tool.startsWith("mcp__")) {
        const server = tool.slice(5).split("__")[0];
        return /playwright|browser|chrome/.test(server) ? "driving the browser" : `talking to ${server}`;
    }
    return TOOLS[tool] || "using a tool";
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
