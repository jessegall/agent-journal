import {ago} from "../format/time.js";

export const SILENT = "silent";

export const SILENT_WORD = "Not responding";

const ENDINGS = {
    completed: {word: "Done", dot: "done"},
    returned: {word: "Done", dot: "done"},
    failed: {word: "Failed", dot: "failed"},
    refused: {word: "Refused", dot: "failed"},
    stopped: {word: "Stopped", dot: ""},
    killed: {word: "Stopped", dot: ""},
};

// the dot and words an agent's run that has ended is shown by: how it ended, and when
export function ending(status, at) {
    const ended = ENDINGS[status] || ENDINGS.completed;
    return {dot: ended.dot, word: at ? `${ended.word} ${ago(at)}` : ended.word};
}

export const named = (task) => `task ${task.id} · ${task.title}`;

// Whether auto would take up a task now: an open one that is not blocked, held by a worker or asked about.
export function queued(tasks, auto) {
    return auto && tasks.some((t) => t.state === "open" && !t.helper_id);
}


