import {context} from "./windowContext.js";

export const PLAN_KEYS = {
    open: {line: "plan board", tab: "open", events: ["plan.*", "phase.*", "task.*"]},
    closed: {line: "plan board --closed", tab: "closed", events: ["plan.*", "phase.*", "task.*"]},
    "older-open": {line: "plan board", loading: "requested"},
    "older-closed": {line: "plan board --closed", loading: "requested"},
    "plan.*": {line: "plan show {id}", loading: "requested"},
};

export const planWindowContext = (answers) => context(answers, null, PLAN_KEYS);
