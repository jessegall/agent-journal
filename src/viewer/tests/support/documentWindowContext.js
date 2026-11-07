import {context} from "./windowContext.js";

export const documentWindowContext = (answers) => context(answers, null, {
    library: {line: "document library"},
});
