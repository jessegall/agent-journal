import {context} from "./windowContext.js";

export const activityWindowContext = (answers, agent = 2) => context(answers, agent, {
    calls: {line: "hook-call feed", events: ["hook_call.*"], page_size: 50},
});
