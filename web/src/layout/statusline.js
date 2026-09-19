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

export function queued(todos, auto, questions = []) {
    const open = todos.filter((t) => !t.completed && !t.deleted);
    const asked = (t) => questions.some((q) => !q.completed && !q.deleted && q.refs.includes(`todo:${t.n}`));
    const waits = (t) => [].concat(t.data.after || []).some((ref) => open.some((o) => `todo:${o.n}` === ref));
    return auto && open.some((t) => !t.data.blocked && !t.data.assigned && !asked(t) && !waits(t));
}

export function wordOf(state, waiting = false) {
    return capital(state === "idle" && waiting ? "waiting" : state);
}

export function lineOf(agent, works, auto = false) {
    const state = stateOf(agent, works);
    if (state === "stopped") return "no agent is on this environment";
    if (state === "compacting") return "compacting its context — it carries on after";
    const current = currentWork(works);
    if (current) return named(current);
    const last = works[works.length - 1];
    if (state === "idle") return said(auto ? "auto" : "idle", agent.data.at);
    const running = agent.data.running;
    return running && running.what && !running.done ? doingOf(running) : said("bearings", agent.data.at);
}

const SAID = {
    inbox: [
        "going through its inbox",
        "reading what you left",
        "catching up on messages",
        "sorting its post",
        "reading the thread",
        "checking the inbox",
        "seeing what came in",
        "taking in your notes",
        "reading what was said",
        "going over the messages",
    ],
    journal: [
        "keeping the journal",
        "writing things down",
        "updating the record",
        "filing its notes",
        "tidying the record",
        "putting things on the record",
        "noting where things stand",
        "bookkeeping",
        "keeping track",
        "writing up the work",
    ],
    tests: [
        "running tests",
        "checking its work",
        "seeing if it holds",
        "running the suite",
        "proving it out",
        "testing the change",
        "letting the tests speak",
        "checking nothing broke",
        "running the checks",
        "verifying",
    ],
    build: [
        "building",
        "compiling",
        "putting the build together",
        "bundling",
        "rebuilding the viewer",
        "assembling",
        "making the build",
        "running the build",
        "packaging",
        "building it up",
    ],
    commit: [
        "committing",
        "saving the work to git",
        "recording a commit",
        "pushing the change",
        "writing the commit",
        "landing the change",
        "checking it in",
        "sealing the change",
        "putting it in history",
        "committing the work",
    ],
    history: [
        "looking at the history",
        "reading the git log",
        "checking what changed",
        "looking back",
        "reading past commits",
        "tracing the history",
        "reviewing the log",
        "seeing what moved",
        "checking the diff",
        "looking through git",
    ],
    code: [
        "looking through the code",
        "reading around",
        "searching the tree",
        "finding the right file",
        "scanning the source",
        "getting the lay of the land",
        "looking things up",
        "hunting through files",
        "reading the layout",
        "exploring the code",
    ],
    script: [
        "running a script",
        "trying something",
        "running a small program",
        "computing something",
        "checking by hand",
        "running a snippet",
        "working it out",
        "running some code",
        "doing a quick check",
        "scripting",
    ],
    service: [
        "talking to a service",
        "fetching something",
        "asking a server",
        "calling out",
        "checking a service",
        "pulling data",
        "reaching out",
        "making a request",
        "querying a service",
        "fetching data",
    ],
    command: [
        "running a command",
        "working in the shell",
        "doing something in the terminal",
        "running things",
        "at the shell",
        "executing a command",
        "using the terminal",
        "running a tool",
        "shelling out",
        "working",
    ],
    reading: [
        "reading the code",
        "reading a file",
        "looking at a file",
        "studying the source",
        "reading closely",
        "going through a file",
        "taking in a file",
        "reading the implementation",
        "looking it over",
        "reading",
    ],
    editing: [
        "editing the code",
        "changing a file",
        "making an edit",
        "writing code",
        "shaping the code",
        "adjusting a file",
        "rewriting a piece",
        "touching up the code",
        "making the change",
        "editing",
    ],
    writing: [
        "writing a file",
        "creating a file",
        "putting a file down",
        "writing something new",
        "adding a file",
        "drafting a file",
        "laying down a file",
        "writing it out",
        "saving a new file",
        "writing",
    ],
    searching: [
        "searching the code",
        "grepping around",
        "looking for something",
        "hunting for a name",
        "finding references",
        "searching the tree",
        "looking for matches",
        "scanning for a pattern",
        "tracking something down",
        "searching",
    ],
    web: [
        "reading the web",
        "looking something up online",
        "checking the docs",
        "reading a page",
        "browsing",
        "fetching a page",
        "searching online",
        "reading documentation",
        "looking online",
        "on the web",
    ],
    helper: [
        "briefing a helper",
        "handing off a task",
        "dispatching an agent",
        "delegating",
        "sending a helper",
        "setting a task",
        "asking for help",
        "starting a subagent",
        "farming out work",
        "briefing an agent",
    ],
    skill: [
        "loading a skill",
        "reading its instructions",
        "picking up a skill",
        "loading guidance",
        "reading a playbook",
        "learning the rules",
        "loading a recipe",
        "reading how it is done here",
        "taking on a skill",
        "loading",
    ],
    list: [
        "sorting its own list",
        "arranging its tasks",
        "updating its list",
        "planning its steps",
        "ordering its work",
        "keeping its list",
        "noting its next steps",
        "revising its plan",
        "ticking things off",
        "listing",
    ],
    browser: [
        "driving the browser",
        "clicking around",
        "looking at the page",
        "checking the viewer",
        "taking a screenshot",
        "poking the page",
        "testing in the browser",
        "watching the page",
        "steering the browser",
        "browsing the viewer",
    ],
    tool: [
        "using a tool",
        "working with a tool",
        "doing something",
        "at work",
        "busy with a tool",
        "handling a tool",
        "running a tool",
        "working away",
        "on a task",
        "working",
    ],
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

const DOING = [
    [/^journal (message|comment|reaction|question)\b/, "inbox"],
    [/^journal\b/, "journal"],
    [/\b(pytest|python3? (-m )?tests?\/|npm test|vitest|jest|phpunit)\b/, "tests"],
    [/\b(npm run build|vite build|make\b|cargo build|go build|tsc\b)/, "build"],
    [/^git (commit|push|add)\b/, "commit"],
    [/^git\b/, "history"],
    [/^(grep|rg|ag|find|ls|cat|sed -n|head|tail|wc|tree|fd)\b/, "code"],
    [/^(python3?|node|php|ruby|perl|bash|sh)\b/, "script"],
    [/^(curl|wget|http)\b/, "service"],
];

const TOOLS = {
    Read: "reading",
    Edit: "editing",
    MultiEdit: "editing",
    NotebookEdit: "editing",
    Write: "writing",
    Grep: "searching",
    Glob: "searching",
    WebFetch: "web",
    WebSearch: "web",
    Agent: "helper",
    Task: "helper",
    Skill: "skill",
    TodoWrite: "list",
};

export function kindOf(running) {
    const tool = running.tool || "Bash";
    if (tool === "Bash") return (DOING.find(([re]) => re.test(running.what.trim())) || [null, "command"])[1];
    if (tool.startsWith("mcp__")) return /playwright|browser|chrome/.test(tool.slice(5).split("__")[0]) ? "browser" : "service";
    return TOOLS[tool] || "tool";
}

export function said(kind, seed) {
    const words = SAID[kind] || SAID.tool;
    return words[Math.floor(Number(seed) || 0) % words.length];
}

export function doingOf(running) {
    return said(kindOf(running), running.at);
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

export function rowsOf(p) {
    return p.data.phases.flatMap((ph) => ph.todos);
}

export function doneOf(p, todos) {
    return rowsOf(p).filter((n) => (todos.find((t) => t.n === n) || {}).completed).length;
}

export function planButton(p) {
    return {ready: ["activate", "Start"], waiting: ["continue", "Continue"], done: ["acknowledge", "Acknowledge"]}[p.data.status] || null;
}
