import {createdAt} from "./row.js";

// The newest dump stays above the chat once it is filed, until the user puts it away.
export function dockedDump(dumps) {
    const newest = [...dumps].sort((a, b) => createdAt(b) - createdAt(a) || b.id - a.id)[0] || null;
    return newest && newest.completed_at && !newest.dismissed ? newest : null;
}
