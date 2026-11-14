import {context} from "./windowContext.js";

export const fileEditsWindowContext = (answers) => context(answers, null, {
    edits: {line: "file-edit list", events: ["file_edit.create"], page_size: 50},
});
