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

// The messages the chat draws in its stream: a docked one sits above the chat instead, until it is undocked.
export function undockedRows(messages, now = Date.now() / 1000) {
    return messages.filter((m) => !isDocked(m, now));
}

// The table and number of the row a docked message stands for, from its ref.
export function dockedRef(message) {
    const [table, id] = String(message.data.row).split(":");
    return {table, id: Number(id)};
}
