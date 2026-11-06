import {context} from "./windowContext.js";

export const usageWindowContext = (answers, agent = null) => context(answers, agent, {
    usage: {line: "usage show", reload_seconds: 30},
});
