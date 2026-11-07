import {mounted, settle} from "./delayedWindowContext.js";
import {context as windowContext} from "./windowContext.js";

const KEYS = {
    status: {line: "library status", events: ["library_connection.*"]},
    copies: {line: "library copies", events: ["library_copy.*"]},
    users: {line: "library-user list", loading: "requested"},
    tokens: {line: "library-user tokens {user}", loading: "requested"},
    item: {line: "library show {share} {id}", loading: "requested"},
    inspection: {line: "library inspect {share} {id}", loading: "requested"},
    listing: {line: "library browse", loading: "requested"},
};

export const context = (answers) => windowContext(answers, null, KEYS);

export {mounted, settle};
