export const PAGE = 50;
export const RECENT = 100;

// how many rows one page of a table holds: the chat opens with its latest 25 messages a person or an agent wrote, the marks between
// them riding along, every other table with 50 rows
const TABLE_PAGES = {messages: 25};
export const pageOf = (table) => TABLE_PAGES[table] || PAGE;

// where the newest page of the rows held starts: a page of the chat counts only the messages a person or an agent wrote
export function pageStart(table, held) {
    if (table !== "messages") return Math.max(held.length - pageOf(table), 0);
    let written = 0;
    for (let at = held.length - 1; at >= 0; at--) {
        if (held[at].author !== "system") written += 1;
        if (written === pageOf(table)) return at;
    }
    return 0;
}
