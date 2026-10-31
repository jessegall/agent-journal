// The lines the journal sent one agent, newest first, from the nudge entries the journal keeps: each with when it was sent and its words.
export const agentLines = (entries, session) =>
    entries
        .filter((entry) => entry.data?.session === session && entry.data?.line)
        .sort((a, b) => b.id - a.id)
        .map((entry) => ({id: entry.id, time: entry.data.time, line: entry.data.line}));
