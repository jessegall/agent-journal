// a chat's messages and marks in one list in the order they happened, each tagged with what it is
export function interleaved(messages, marks) {
    const items = [...messages.map((row) => ({kind: "message", id: `message:${row.id}`, row})), ...marks.map((row) => ({kind: "mark", id: `mark:${row.id}`, row}))];
    return items.sort((a, b) => a.row.created_at - b.row.created_at || (a.kind === b.kind ? a.row.id - b.row.id : a.kind === "message" ? -1 : 1));
}
