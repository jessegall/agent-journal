import {context} from "./windowContext.js";

export const gitWindowContext = (answers) => context(answers, null, {
    branches: {line: "git-overview branches"},
    commits: {line: "git-overview commits"},
    pulls: {line: "git-overview pulls"},
});
