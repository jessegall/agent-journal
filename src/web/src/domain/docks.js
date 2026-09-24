import {isUpdate} from "./updates.js";

const newestOf = (rows) => rows.filter((r) => !r.deleted).sort((a, b) => b.created - a.created || b.n - a.n)[0] || null;

export function dockedReport(reports) {
    const newest = newestOf(reports);
    if (!newest || newest.completed || newest.data.dismissed) return null;
    return isUpdate(newest) || !newest.seen.includes("user") ? newest : null;
}

export function dockedDump(dumps) {
    const newest = newestOf(dumps);
    return newest && newest.completed && !newest.data.dismissed ? newest : null;
}

export const dumpCollection = (dump) => Number((dump.refs.find((ref) => ref.startsWith("collection:")) || "").split(":")[1] || 0);
