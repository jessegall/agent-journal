export function withWhispers(turns, nudges, session) {
    if (!turns.length) return turns;
    const from = turns[0].at;
    const whispers = nudges
        .filter((n) => n.data.session === session && n.created >= from)
        .map((n) => ({
            line: `nudge ${n.n}`,
            kind: "whisper",
            at: n.created,
            text: n.brief ? `${n.title} — ${n.brief}` : n.title,
            tools: [],
        }));
    return whispers.length ? [...turns, ...whispers].sort((a, b) => a.at - b.at) : turns;
}

const spoken = (t) => (t.kind === "agent" || t.kind === "human") && t.text;

export function chatTurns(entries) {
    return entries.flatMap((t) => {
        if (spoken(t)) {
            const who = t.kind === "human" ? "user" : "agent";
            return [
                {
                    type: "line",
                    ref: `line:${t.line}`,
                    n: t.line,
                    who,
                    title: "",
                    brief: t.text,
                    abstract: "",
                    refs: [],
                    sections: [],
                    seen: ["user", "agent"],
                    data: {},
                    created: t.at,
                    completed: 0,
                },
            ];
        }
        if (t.tools && t.tools.length)
            return [
                {
                    type: "card",
                    ref: `tools:${t.line}`,
                    n: t.line,
                    created: t.at,
                    data: {icon: "terminal", label: `Used ${t.tools.join(", ")}`},
                },
            ];
        return [];
    });
}
