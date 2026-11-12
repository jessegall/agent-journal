// Where a chat bubble folds behind Show more, as version 4 folded it (src/web/src/domain/turnFolds.js): by the height of the drawn text, in pixels. A bubble
// taller than `at` folds and shows `keep` pixels until opened. A worker's report is its own kind, folded to about its first two lines; the user's words and
// the agent's reply are one kind. One table, so a length changes in one line.
export const FOLDS = {
    report: {at: 70, keep: 46},
    message: {at: 420, keep: 320},
};

const foldKind = (message) => (message.worker_id != null ? "report" : "message");

export const foldOf = (message) => FOLDS[foldKind(message)];
