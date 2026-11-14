import {context} from "./windowContext.js";

export const AGENT_EDIT_KEYS = {"agent-edits.*": {line: "file-edit list --agent {id}", page_size: 50, events: []}};

export const fileFeedWindowContext = (answers, agent = null, view = {}) => context({
    "window setting coding.file-feed view": {ok: true, value: {value: view}},
    ...answers,
}, agent, {
    edits: {line: "file-edit list", events: ["file_edit.create"], page_size: 50},
    view: {line: "window setting coding.file-feed view", events: []},
    "file.*": {line: "file-edit file {id}", events: []},
});
