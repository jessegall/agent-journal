const SAID = {
    create: (noun) => `adding a ${noun}`,
    complete: (noun, n) => `closing ${noun} ${n}`,
    read: (noun, n) => `reading ${noun} ${n}`,
    show: (noun, n) => `reading ${noun} ${n}`,
    unread: (noun) => `checking for unread ${noun}s`,
    all: (noun) => `the ${noun} list`,
    update: (noun, n) => `updating ${noun} ${n}`,
    reply: (noun, n) => `replying to ${noun} ${n}`,
    comment: (noun, n) => `commenting on ${noun} ${n}`,
    link: (noun, n) => `linking ${noun} ${n}`,
    delete: (noun, n) => `dropping ${noun} ${n}`,
    search: (noun) => `searching the ${noun}s`,
    priority: (noun, n) => `reordering ${noun} ${n}`,
    start: () => "starting work",
    end: (noun, n) => `ending work ${n}`,
};

const QUERIES = {
    open: "the open work",
    status: "where things stand",
    search: "searching the record",
    user: "reading the user's words",
    carry: "what a session is handed",
};

function ing(word) {
    if (word.endsWith("e")) return `${word.slice(0, -1)}ing`;
    if (/[^aeiou][aeiou][bdgmnprt]$/.test(word)) return `${word}${word.slice(-1)}ing`;
    return `${word}ing`;
}

function fallback(said, name, n) {
    return said.endsWith("s") ? `the ${said} of ${name} ${n}` : `${ing(said)} ${name} ${n}`;
}

export function spoken(words, types) {
    const [noun, said, ...rest] = words;
    const kind = types.find((t) => t.name === noun || `${t.name}s` === noun);
    const n = rest.find((x) => /^\d+$/.test(x)) || rest.find((x) => /^\$\{?\w+\}?$/.test(x)) || "";
    if (!kind) return QUERIES[noun] || (noun ? `checking ${noun}` : "the journal");
    const name = kind.title.toLowerCase();
    if (!said) return `the ${name} list`;
    const method = Object.entries(kind.names).find(([, w]) => w === said);
    const action = method ? method[0] : said;
    const say = SAID[said] || SAID[action];
    return say ? say(name, n).trim() : fallback(said, name, n).trim();
}
