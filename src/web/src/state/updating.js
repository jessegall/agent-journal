import {reactive} from "vue";
import {remember, remembered} from "../platform/storage.js";

export const UPDATED_KEY = "journal.updated.to";
export const STEPS = ["Installing the new version", "Restarting the journal", "Loading the new version"];
const SECOND_STEP_AT = 8;
const THIRD_STEP_AT = 25;

export const updating = reactive({version: "", failure: "", late: false, since: 0});

export const stepAt = (seconds) => (seconds < SECOND_STEP_AT ? STEPS[0] : seconds < THIRD_STEP_AT ? STEPS[1] : STEPS[2]);
export const locked = () => Boolean(updating.version) && !updating.failure && !updating.late;

export function begin(version) {
    Object.assign(updating, {version, failure: "", late: false, since: Date.now() / 1000});
    remember(UPDATED_KEY, version);
}

export function fail(reason) {
    updating.failure = reason;
    remember(UPDATED_KEY, "");
}

export function runLate() {
    updating.late = true;
}

export function clear() {
    Object.assign(updating, {version: "", failure: "", late: false, since: 0});
}

export const updatedTo = () => remembered(UPDATED_KEY, "");
export const forgetUpdate = () => remember(UPDATED_KEY, "");
