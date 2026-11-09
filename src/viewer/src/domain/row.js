// What every row answers the same way, read from its own table's fields: its reference, its title and body, when it was made
// and changed, and when it closed. The journal answers a row as its model's fields with the table it is from.

// A time the journal sends as an ISO date, as seconds since the epoch; a number is seconds already, none is 0.
export const seconds = (at) => (typeof at === "number" ? at : at ? Date.parse(at) / 1000 : 0);

export const refOf = (row) => `${row.table}:${row.id}`;

export const firstLine = (text) => (text || "").split("\n").find((line) => line.trim()) || "";

export const TITLE_CHARACTERS = 80;

// A line short enough for a title: cut after the last whole word that fits, with an ellipsis where it was cut.
function cutShort(line) {
    if (line.length <= TITLE_CHARACTERS) return line;
    const cut = line.slice(0, TITLE_CHARACTERS + 1).replace(/\s+\S*$/, "");
    return `${cut || line.slice(0, TITLE_CHARACTERS)}…`;
}

const TITLES = {
    messages: (r) => cutShort(firstLine(r.text)),
    comments: (r) => cutShort(firstLine(r.text)),
    questions: (r) => r.text,
    memories: (r) => `${r.text} (weight ${r.weight})`,
    rules: (r) => r.text,
    reminders: (r) => r.text,
    environments: (r) => r.name,
    agents: (r) => r.session,
    workers: (r) => r.name,
    triggers: (r) => (r.phrases || []).join(", "),
    reactions: (r) => r.face,
    nudges: (r) => r.data?.line || "",
    plugins: (r) => r.manifest?.title || r.name,
    shares: (r) => `Share of ${r.target || "nothing"}`,
};

export const titleOf = (row) => (TITLES[row.table] ? TITLES[row.table](row) : row.title || "") || "";

export const createdAt = (row) => seconds(row.created_at);
export const updatedAt = (row) => seconds(row.updated_at) || createdAt(row);

