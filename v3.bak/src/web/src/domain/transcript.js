export function withWhispers(turns, nudges, session) {
    if (!turns.length) return turns;
    const from = turns[0].at;
    const whispers = nudges
        .filter((n) => n.data.session === session && n.created >= from)
        .map((n) => ({
            line: `reminder ${n.n}`,
            kind: "whisper",
            at: n.created,
            text: n.brief ? `${n.title} — ${n.brief}` : n.title,
            tools: [],
        }));
    return whispers.length ? [...turns, ...whispers].sort((a, b) => a.at - b.at) : turns;
}

const SPEAKERS = {agent: "agent", human: "user", injected: "user"};
const hasText = (t) => SPEAKERS[t.kind] && t.text;

const line = (t) => ({
    type: "line",
    ref: `line:${t.line}`,
    n: t.line,
    who: SPEAKERS[t.kind],
    title: "",
    brief: t.said || t.text,
    abstract: "",
    refs: [],
    sections: [],
    seen: ["user", "agent"],
    data: {},
    created: t.at,
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
                run = {type: "card", ref: `tools:${t.line}`, n: t.line, created: t.at, tools: [], data: {icon: "terminal", label: ""}};
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
        return {...t, data: {...t.data, from_main: true, opening}};
    });
}

export const briefOf = (entries) => {
    const first = entries.find((t) => hasText(t) && SPEAKERS[t.kind] === "user");
    return first ? {text: first.text, at: first.at} : null;
};
