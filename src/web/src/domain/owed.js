export const owed = (row) => row.who === "user" && Boolean(row.data?.asks) && !row.completed;
