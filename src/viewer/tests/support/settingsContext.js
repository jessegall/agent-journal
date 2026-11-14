import {mounted, settle} from "./delayedWindowContext.js";
import {context as baseContext} from "./windowContext.js";

const KEYS = {
    settings: {line: "setting tree", tab: "settings", events: ["setting.*"]},
    environments: {line: "environment cards", tab: "environments", events: ["environment.*"]},
    commands: {line: "alias saved --limit 1000", events: ["alias.*"], loading: "requested"},
};

export const context = (answers) => baseContext(answers, null, KEYS);
export {page, typeInto} from "./windowContext.js";

export {mounted, settle};
