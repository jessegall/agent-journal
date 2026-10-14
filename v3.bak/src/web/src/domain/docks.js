
const newestOf = (rows) => rows.filter((r) => !r.deleted).sort((a, b) => b.created - a.created || b.n - a.n)[0] || null;

// The newest report stays above the chat while the server keeps it docked (features/report_dock): until the user opens it, presses one of its
// buttons or puts it away
export function dockedReport(reports) {
    const newest = newestOf(reports);
    return newest && !newest.completed && newest.data.docked ? newest : null;
}

export function dockedDump(dumps) {
    const newest = newestOf(dumps);
    return newest && newest.completed && !newest.data.dismissed ? newest : null;
}

export const dumpCollection = (dump) => Number((dump.refs.find((ref) => ref.startsWith("collection:")) || "").split(":")[1] || 0);
