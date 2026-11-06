import {context} from "./windowContext.js";

export const triggerWindowContext = (answers) => context(answers, null, {
    triggers: {line: "trigger list", events: ["trigger.*"]},
});
