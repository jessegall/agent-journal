export function withWhispers(turns, nudges, session) {
    if (!turns.length) return turns;
    const from = turns[0].at;
    const said = nudges
        .filter((n) => n.data.session === session && n.created >= from)
        .map((n) => ({
            line: `nudge ${n.n}`,
            kind: "whisper",
            at: n.created,
            text: n.brief ? `${n.title} — ${n.brief}` : n.title,
            tools: [],
        }));
    return said.length ? [...turns, ...said].sort((a, b) => a.at - b.at) : turns;
}
