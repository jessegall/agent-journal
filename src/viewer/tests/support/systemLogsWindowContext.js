import {context} from "./windowContext.js";

export const systemLogsWindowContext = (answers) => context(answers, null, {
    logs: {line: "developer system-logs"},
});
