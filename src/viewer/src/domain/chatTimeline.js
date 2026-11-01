const moment = (value) => (typeof value === "number" ? value : Date.parse(value));

// a chat's messages and marks in one list in the order they happened, each tagged with what it is
export function interleaved(messages, marks) {
    const timed = (kind, row) => ({kind, id: `${kind}:${row.id}`, row, time: moment(row.created_at) / 1000});
    const items = [...messages.map((row) => timed("message", row)), ...marks.map((row) => timed("mark", row))];
    return items.sort((a, b) => moment(a.row.created_at) - moment(b.row.created_at) || (a.kind === b.kind ? a.row.id - b.row.id : a.kind === "message" ? -1 : 1));
}
