const DAY_MS = 24 * 60 * 60 * 1000;
const GROUPS = [
    {key: "today", title: "Today", days: 1},
    {key: "week", title: "Last 7 days", days: 7},
    {key: "month", title: "Last 30 days", days: 30},
    {key: "older", title: "Older", days: Infinity},
];

// the rows a search keeps: its words found in the title or the abstract
export function searched(rows, words) {
    const wanted = words.trim().toLowerCase();
    if (!wanted) return rows;
    return rows.filter((row) => `${row.title} ${row.abstract}`.toLowerCase().includes(wanted));
}

// the rows in the chosen order: newest first by when each was last written, or by title
export function sorted(rows, order) {
    const copy = [...rows];
    if (order === "title") return copy.sort((a, b) => a.title.localeCompare(b.title));
    return copy.sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
}

// the rows under the age heading each falls in, newest first; a title order keeps one group
export function grouped(rows, order, now = Date.now()) {
    if (order === "title") return rows.length ? [{key: "all", title: "", rows}] : [];
    const groups = GROUPS.map((group) => ({...group, rows: []}));
    for (const row of rows) {
        const days = (now - Date.parse(row.updated_at)) / DAY_MS;
        groups.find((group) => days < group.days).rows.push(row);
    }
    return groups.filter((group) => group.rows.length);
}

// how long ago a row was written, in the shortest plain form
export function age(text, now = Date.now()) {
    const minutes = Math.max(0, Math.round((now - Date.parse(text)) / 60000));
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h`;
    return `${Math.round(minutes / (60 * 24))}d`;
}
