import {context} from "./windowContext.js";

export const outputWindowContext = (answers, output = 0) => {
    answers["window setting processes.output output"] = {ok: true, value: {value: output}};
    return context(answers, null, {
        selection: {line: "window setting processes.output output", loading: "requested"},
        latest: {line: "process feed --limit 1", loading: "requested"},
        "run.*": {line: "process feed --id {id}", loading: "requested"},
        "summary.*": {line: "output peek {id} --summary", loading: "requested"},
        "output.*": {line: "output page {id}", loading: "requested"},
    });
};
