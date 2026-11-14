import {context} from "./windowContext.js";

export const updateWindowContext = (answers) => context(answers, null, {
    releases: {line: "release list", events: ["release.*"]},
    standing: {line: "update check", events: ["release.*", "release_install.*"]},
    notes: {line: "update notes"},
});
