export function withWhispers(turns, nudges, session) {
    if (!turns.length) return turns;
    const from = turns[0].time;
    const whispers = nudges
        .filter((n) => n.data.session === session && n.created >= from)
        .map((n) => ({
            line: `reminder ${n.n}`,
            turn_type: "whisper",
            time: n.created,
            text: n.brief ? `${n.title} — ${n.brief}` : n.title,
            tools: [],
        }));
    return whispers.length ? [...turns, ...whispers].sort((a, b) => a.time - b.time) : turns;
}

const SPEAKERS = {agent: "agent", human: "user", injected: "user"};
const hasText = (t) => SPEAKERS[t.turn_type] && t.text;

// a spoken turn drawn as a message bubble, and a run of tool calls as a card: `kind` is what the chat's Turn switches on
const line = (t) => ({
    type: "line",
    kind: "message",
    ref: `line:${t.line}`,
    n: t.line,
    who: SPEAKERS[t.turn_type],
    title: "",
    text: t.said || t.text,
    brief: t.said || t.text,
    abstract: "",
    refs: [],
    sections: [],
    seen: ["user", "agent"],
    data: {},
    created: t.time,
    completed: 0,
});

const counted = (tools) =>
    Object.entries(tools.reduce((all, tool) => ({...all, [tool]: (all[tool] || 0) + 1}), {}))
        .map(([tool, times]) => (times > 1 ? `${tool} ×${times}` : tool))
        .join(", ");

export function chatTurns(entries) {
    const out = [];
    let run = null;
    for (const t of entries) {
        if (hasText(t)) {
            run = null;
            out.push(line(t));
        } else if (t.tools && t.tools.length) {
            if (!run) {
                run = {type: "card", kind: "card", ref: `tools:${t.line}`, n: t.line, created: t.time, tools: [], data: {icon: "terminal", label: ""}};
                out.push(run);
            }
            run.tools.push(...t.tools);
            run.data = {...run.data, label: `Used ${counted(run.tools)}`};
        }
    }
    return out;
}

export function fromMainAgent(turns) {
    let first = true;
    return turns.map((t) => {
        if (t.type !== "line" || t.who !== "user") return t;
        const opening = first;
        first = false;
        return {...t, who: "agent", data: {...t.data, from_main: true, opening}};
    });
}

export const briefOf = (entries) => {
    const first = entries.find((t) => hasText(t) && SPEAKERS[t.turn_type] === "user");
    return first ? {text: first.text, time: first.time} : null;
};

// What a subagent handed back: the last thing it said.
export const reportOf = (entries) => {
    const last = entries.findLast((t) => hasText(t) && SPEAKERS[t.turn_type] === "agent");
    return last ? {text: last.text, time: last.time} : null;
};

const changedLines = (added, removed) => `${added} ${added === 1 ? "line" : "lines"} added, ${removed} removed`;

// What one tool call did, in words, from the operation its provider decoded; a call with none decoded names its tool.
const STEPS = {
    "shell line": (s) => ({icon: "terminal", words: "Ran", code: s.command, rest: "", shell: true}),
    "file edit": (s) => ({icon: "pencil", words: "Changed", code: s.paths.join(", "), rest: changedLines(s.added, s.removed)}),
    "file write": (s) => ({icon: "docs", words: "Wrote", code: s.path, rest: `${s.added} ${s.added === 1 ? "line" : "lines"}`}),
    "file read": (s) => ({icon: "book", words: "Read", code: s.path, rest: s.partial ? "part of it" : ""}),
    "skill load": (s) => ({icon: "book", words: "Loaded the skill", code: s.skill, rest: ""}),
    "subagent dispatch": (s) => ({icon: "agents", words: "Started a subagent:", code: "", rest: s.title}),
    "agent message": (s) => ({icon: "chat", words: `Sent a message to ${s.receiver}`, code: "", rest: ""}),
    "user question": () => ({icon: "questions", words: "Asked the user a question", code: "", rest: ""}),
    "undecoded tool": (s) => ({icon: "tools", words: "Used", code: s.name, rest: ""}),
};

export const stepOf = (operation) => (STEPS[operation.kind] || STEPS["undecoded tool"])(operation);

const stepsOf = (t) => (t.steps && t.steps.length ? t.steps : t.tools.map((name) => ({kind: "undecoded tool", name}))).map(stepOf);

// A transcript as its speakers said it: each spoken turn with the steps it took after, each step with the line of its output.
export function saidTurns(entries, speakers) {
    const out = [];
    let last = null;
    for (const t of entries) {
        if (t.turn_type === "tool") {
            const step = last && last.steps.find((s) => !s.output);
            if (step) step.output = t.line;
            continue;
        }
        const spoken = hasText(t) && speakers[t.turn_type];
        if (spoken || (t.tools.length && (!last || last.turn_type !== t.turn_type))) {
            last = {key: t.line, turn_type: t.turn_type, who: speakers[t.turn_type] || t.turn_type, time: t.time, text: spoken ? t.text : "", steps: []};
            out.push(last);
        }
        if (t.tools.length) last.steps.push(...stepsOf(t).map((step) => ({...step, output: 0})));
    }
    return out;
}
