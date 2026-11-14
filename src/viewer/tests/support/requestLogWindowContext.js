import {context} from "./windowContext.js";

export const requestLogWindowContext = (answers = {}) => context(answers, null, {
    requests: {line: "developer hook-requests"},
    queue: {line: "queue list", loading: "requested"},
});
