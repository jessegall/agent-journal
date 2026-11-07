import {context} from "./windowContext.js";

export const templateWindowContext = (answers) => context(answers, null, {
    templates: {line: "template list", events: ["template.*"]},
});
