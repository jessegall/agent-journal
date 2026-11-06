import {context} from "./windowContext.js";

export const questionCardContext = (answers) => context(answers, null, {
    "question.*": {line: "question show {id}", events: ["question.*"], loading: "requested"},
});
