import {createdAt, updatedAt} from "./row.js";

// The newest dump stays above the chat once it is filed, until the user puts it away.
export function dockedDump(dumps) {
    const newest = [...dumps].sort((a, b) => createdAt(b) - createdAt(a) || b.id - a.id)[0] || null;
    return newest && newest.completed_at && !newest.dismissed ? newest : null;
}

// Whether a message sits docked above the chat at a moment, in seconds: a card that docked itself leaves once the time it
// lingers after its run's end has passed.
export const isDocked = (m, now) => m.data?.docked === true && !(m.data.undock_at && now >= m.data.undock_at);

// Every row docked above the chat, newest first: a system message whose data carries docked and the row's card.
export function dockedRows(messages, now = Date.now() / 1000) {
    return messages.filter((m) => isDocked(m, now)).sort((a, b) => updatedAt(b) - updatedAt(a) || b.id - a.id);
}

// The messages the chat draws in its stream: every one stays at its place, a docked one marked docked so it is drawn faded
// while it also sits above the chat, and unmarked once it leaves the dock.
export function streamRows(messages, now = Date.now() / 1000) {
    return messages.map((m) => (m.data?.docked === true && !isDocked(m, now) ? {...m, data: {...m.data, docked: false}} : m));
}

// The tables whose rows can be docked above the chat from their inspector.
export const DOCKABLE = new Set(["tasks", "plans", "docs", "reports", "facts", "rules", "reminders", "questions", "sequences", "templates", "workers", "triggers", "checks", "dumps", "notices"]);

// Whether the row of `table` numbered `id` sits docked above the chat, read from the messages that dock it.
export const isRowDocked = (messages, table, id, now = Date.now() / 1000) => messages.some((m) => isDocked(m, now) && m.data.row === `${table}:${id}`);

// The table and number of the row a docked message stands for, from its ref.
export function dockedRef(message) {
    const [table, id] = String(message.data.row).split(":");
    return {table, id: Number(id)};
}
