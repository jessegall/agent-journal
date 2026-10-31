// What every row answers the same way, read from its own table's fields: its reference, its title and body, when it was made
// and changed, and when it closed. The journal answers a row as its model's fields with the table it is from.

// A time the journal sends as an ISO date, as seconds since the epoch; a number is seconds already, none is 0.
export const seconds = (at) => (typeof at === "number" ? at : at ? Date.parse(at) / 1000 : 0);

export const refOf = (row) => `${row.table}:${row.id}`;

const firstLine = (text) => (text || "").split("\n").find((line) => line.trim()) || "";

export const TITLE_CHARACTERS = 80;

// A line short enough for a title: cut after the last whole word that fits, with an ellipsis where it was cut.
export function cutShort(line) {
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

const BODIES = {
    docs: (r) => r.body,
    reports: (r) => r.body,
    messages: (r) => r.text,
    comments: (r) => r.text,
    rules: (r) => r.reason,
    triggers: (r) => r.text,
    notices: (r) => r.link,
};

export const bodyOf = (row) => (BODIES[row.table] ? BODIES[row.table](row) : row.brief) || "";

const ENDED = ["done", "cancelled"];

const CLOSED = {
    tasks: (r) => seconds(r.completed_at) || (r.state === "cancelled" ? seconds(r.updated_at) : 0),
    questions: (r) => (r.answer ? seconds(r.updated_at) : 0),
    plans: (r) => (ENDED.includes(r.state) ? seconds(r.updated_at) : 0),
    notices: (r) => seconds(r.closed_at),
    secrets: (r) => seconds(r.deleted_at),
    workers: (r) => (r.state === "stopped" ? seconds(r.updated_at) : 0),
    shares: (r) => seconds(r.stopped_at),
    dumps: (r) => seconds(r.completed_at),
    agents: (r) => (r.state === "ended" ? seconds(r.updated_at) : 0),
    // a check a wait made for itself is listed apart from the project's own, under Waits
    checks: (r) => (r.wait_target ? seconds(r.created_at) : 0),
};

// When the row closed, in seconds; 0 while it is open, and always for a table whose rows never close.
export const closedAt = (row) => (CLOSED[row.table] ? CLOSED[row.table](row) : 0);
export const isClosed = (row) => closedAt(row) > 0;
// whether a table's rows close, as a task is done or a question answered; a message never does
export const closable = (table) => Boolean(CLOSED[table]);
export const createdAt = (row) => seconds(row.created_at);
export const updatedAt = (row) => seconds(row.updated_at) || createdAt(row);

// Who made the row: the user, the agent, the journal or a plugin, from its stamp, user:1 or agent:s1.
export const madeBy = (row) => (row.creator || "system").split(":")[0];

// The second-level headings of a document's or report's body, each with the text under it.
export function sectionsOf(body) {
    const parts = (body || "").split(/^## +(.+)$/m);
    const found = [];
    for (let i = 1; i < parts.length - 1; i += 2) found.push({title: parts[i].trim(), body: parts[i + 1].trim()});
    return found;
}
