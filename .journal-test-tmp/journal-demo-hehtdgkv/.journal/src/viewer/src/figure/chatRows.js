// who said a chat message, by its type: the figure tells the user's words from the agent's, and leaves the journal's own and a peer's alone
const AUTHORS = {user: "user", comment: "user", agent: "agent"};

// The chat's message rows as the figure reads them: those the user or the agent said, leaving out one still being sent, each with its author and
// the table its chat mark names
export const messagesOfRows = (rows) => rows.filter((row) => AUTHORS[row.type] && !row.local).map((row) => ({...row, table: "message", author: AUTHORS[row.type]}));
