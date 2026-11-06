import {context} from "./windowContext.js";

export const commandsWindowContext = (answers) => context(answers, null, {
    runs: {line: "process feed", events: ["process.*", "output.*"]},
});
