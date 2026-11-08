// Where a chat bubble folds behind Show more, by the kind of message: a bubble folds when its text has more characters or more lines than
// the kind may hold whole, and shows `shown` lines until opened. One table, so a length changes in one line.
export const FOLDS = {
    person: {chars: 480, lines: 8, shown: 6},
    agent: {chars: 600, lines: 10, shown: 8},
    report: {chars: 140, lines: 2, shown: 2},
};

export function foldKind(message) {
    if (message.worker_id != null) return "report";
    return ["user", "comment"].includes(message.type) ? "person" : "agent";
}

const linesOf = (text) => text.split("\n").filter((line) => line.trim()).length;

export function foldOf(message) {
    const fold = FOLDS[foldKind(message)];
    const text = message.text ?? "";
    return {...fold, long: text.length > fold.chars || linesOf(text) > fold.lines};
}
