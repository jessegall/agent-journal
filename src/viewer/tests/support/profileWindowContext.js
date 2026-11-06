import {context} from "./windowContext.js";

export const profileWindowContext = (answers) => context(answers, null, {
    profiles: {line: "profile list"},
    availability: {line: "helper availability", loading: "requested"},
});
