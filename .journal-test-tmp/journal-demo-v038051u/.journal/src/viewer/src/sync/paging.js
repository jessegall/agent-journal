export const PAGE = 50;
export const RECENT = 100;

// how many rows one page of a table holds: the chat opens with its latest 25 messages a person or an agent wrote, the marks between
// them riding along, every other table with 50 rows
const TABLE_PAGES = {messages: 25};
export const pageOf = (table) => TABLE_PAGES[table] || PAGE;

