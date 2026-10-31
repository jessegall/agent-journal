import {createdAt} from "./row.js";

// The newest dump stays above the chat once it is filed, until the user puts it away.
export function dockedDump(dumps) {
    const newest = [...dumps].sort((a, b) => createdAt(b) - createdAt(a) || b.id - a.id)[0] || null;
    return newest && newest.completed_at && !newest.dismissed ? newest : null;
}

// Whether a message sits docked above the chat at a moment, in seconds: a card that docks itself comes once its run has gone on
// the while it waits for, and leaves once the time it lingers after its run's end has passed, unless the user is pointing at it.
export const isDocked = (m, now) =>
    m.data?.docked === true &&
    !(m.data.dock_at && now < m.data.dock_at) &&
    !(m.data.undock_at && !m.data.held_at && now >= m.data.undock_at);

// Whether a docked message stands for a run, an output it watches or a check it runs, and not a row docked from its inspector
export const isRun = (m) => Boolean(m.data.output || m.data.check);

// The most runs the docks hold at once: past it, the runs that finished are cleared, the oldest first, and a run still going always stays
export const MOST_DOCKED_RUNS = 6;

// The runs docked, in the order each docked, with the finished ones past MOST_DOCKED_RUNS cleared oldest first
export function keptRuns(runs, most = MOST_DOCKED_RUNS) {
    const over = runs.length - most;
    if (over <= 0) return runs;
    const now = Date.now() / 1000;
    const leaving = (m) => m.data.ending && !m.data.pinned && !(m.data.undock_at > now);
    const cleared = new Set(runs.filter(leaving).slice(0, over).map((m) => m.id));
    return runs.filter((m) => !cleared.has(m.id));
}

// Whether a docked card closes by itself: one the journal docked, once its run ended, until the user keeps it
export const isLeaving = (m) => Boolean(!m.data.pinned && m.data.undock_at);

// Every row docked above the chat, in the order each docked: a system message whose data carries docked and the row's card. The
// newest sits at the bottom, nearest the composer, pushing the earlier ones up, and none changes place as it updates.
export function dockedRows(messages, now = Date.now() / 1000) {
    return messages.filter((m) => isDocked(m, now)).sort((a, b) => createdAt(a) - createdAt(b) || a.id - b.id);
}

// The messages the chat draws in its stream: every one stays at its place, a docked one marked docked so it is drawn faded
// while it also sits above the chat, and unmarked once it leaves the dock.
export function streamRows(messages, now = Date.now() / 1000) {
    return messages.map((m) => (m.data?.docked === true && !isDocked(m, now) ? {...m, data: {...m.data, docked: false}} : m));
}

// The tables whose rows can be docked above the chat from their inspector.
export const DOCKABLE = new Set([
    "tasks",
    "plans",
    "docs",
    "reports",
    "memories",
    "rules",
    "reminders",
    "questions",
    "sequences",
    "templates",
    "workers",
    "triggers",
    "checks",
    "dumps",
    "notices",
]);

// Whether the row of `table` numbered `id` sits docked above the chat, read from the messages that dock it.
export const isRowDocked = (messages, table, id, now = Date.now() / 1000) =>
    messages.some((m) => isDocked(m, now) && m.data.row === `${table}:${id}`);

// The table and number of the row a docked message stands for, from its ref.
export function dockedRef(message) {
    const [table, id] = String(message.data.row).split(":");
    return {table, id: Number(id)};
}
