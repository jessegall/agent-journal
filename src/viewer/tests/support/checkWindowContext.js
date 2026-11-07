import {context} from "./windowContext.js";

export const checkWindowContext = (answers) => context(answers, null, {
    checks: {line: "check list", events: ["check.*"]},
    "runs.*": {line: "check runs {id}", events: []},
});
