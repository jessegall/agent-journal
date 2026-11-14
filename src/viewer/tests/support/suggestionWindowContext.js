import {context} from "./windowContext.js";

export const suggestionWindowContext = (answers) => context(answers, null, {
    suggestions: {line: "suggestion list", events: ["suggestion.*"]},
});
