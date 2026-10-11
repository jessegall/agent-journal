import {isUpdate} from "./updates.js";

const newestOf = (rows) => rows.filter((r) => !r.deleted).sort((a, b) => b.created - a.created || b.n - a.n)[0] || null;

// A report stays above the chat until it is closed, read, or the person has written to the agent since it came: the work it was for has moved on.
export function dockedReport(reports, lastWrittenAt = 0) {
    const newest = newestOf(reports);
    if (!newest || newest.completed || newest.data.dismissed) return null;
    if (isUpdate(newest)) return newest;
    return !newest.seen.includes("user") && newest.created > lastWrittenAt ? newest : null;
}

export function dockedDump(dumps) {
    const newest = newestOf(dumps);
    return newest && newest.completed && !newest.data.dismissed ? newest : null;
}

export const dumpCollection = (dump) => Number((dump.refs.find((ref) => ref.startsWith("collection:")) || "").split(":")[1] || 0);
