import {context} from "./windowContext.js";

export const projectFilesWindowContext = (answers) => context(answers, null, {
    entries: {line: "project-file list {folder}"},
    matches: {line: "project-file find {words}", loading: "requested"},
    file: {line: "project-file show {path}", loading: "requested"},
});
