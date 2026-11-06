import {context} from "./windowContext.js";

export const questionsWindowContext = (answers) => context(answers, null, {
    questions: {line: "question list --all", tab: "list", events: ["question.*"]},
    "question.*": {line: "question show {id}", events: ["question.*"], loading: "requested"},
});
