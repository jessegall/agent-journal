export function withWhispers(turns, nudges, session) {
    if (!turns.length) return turns;
    const from = turns[0].time;
    const whispers = nudges
        .filter((n) => n.data.session === session && n.created >= from)
        .map((n) => ({
            line: `reminder ${n.n}`,
            kind: "whisper",
            time: n.created,
            text: n.brief ? `${n.title} — ${n.brief}` : n.title,
            tools: [],
        }));
    return whispers.length ? [...turns, ...whispers].sort((a, b) => a.time - b.time) : turns;
}

const SPEAKERS = {agent: "agent", human: "user", injected: "user"};
const hasText = (t) => SPEAKERS[t.kind] && t.text;

// a spoken turn drawn as a message bubble, and a run of tool calls as a card: `kind` is what the chat's Turn switches on
const line = (t) => ({
    type: "line",
    kind: "message",
    ref: `line:${t.line}`,
    n: t.line,
    who: SPEAKERS[t.kind],
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
    const first = entries.find((t) => hasText(t) && SPEAKERS[t.kind] === "user");
    return first ? {text: first.text, time: first.time} : null;
};
