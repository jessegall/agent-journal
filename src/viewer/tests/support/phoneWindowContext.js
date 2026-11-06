import {context} from "./windowContext.js";

export const phoneWindowContext = (answers) => context(answers, null, {
    phones: {line: "phone list", events: ["phone.*"]},
    tunnel: {line: "tunnel status"},
});
