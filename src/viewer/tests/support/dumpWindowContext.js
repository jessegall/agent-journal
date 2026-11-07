import {context} from "./windowContext.js";

export const dumpWindowContext = (answers) => context(answers, null, {
    dumps: {line: "dump board", events: ["dump.*", "dump_item.*"]},
});
