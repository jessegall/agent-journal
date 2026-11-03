import {reactive} from "vue";
import {remember} from "../platform/storage.js";

export const UPDATED_KEY = "journal.updated.to";
export const STEPS = ["Installing the new version", "Restarting the journal", "Loading the new version"];

export const updating = reactive({
    version: "",
    failure: "",
    late: false,
    since: 0,
    external: false,
    step: "",
    countdown: null,
    target: "",
    starting: false,
    bootStep: "",
});

export const locked = () => Boolean(updating.version || updating.external) && !updating.failure && !updating.late;

// Whether the update cover is up: counting down to an update, or one under way.
export const covered = () => Boolean(updating.countdown) || locked() || updating.starting;

// The server says whether it has booted and is ready; an older server says nothing, which leaves the page as it is.
export function starting(ready, step = "") {
    updating.starting = ready === false;
    updating.bootStep = updating.starting ? step : "";
}

// The automatic update the server is counting down to, with the second it starts at; none clears it.
export function counting(countdown) {
    if (countdown && countdown.version) updating.target = countdown.version;
    updating.countdown =
        countdown && countdown.version
            ? {version: countdown.version, until: Date.now() / 1000 + countdown.seconds, starting: Boolean(countdown.starting)}
            : null;
}

export function begin(version) {
    Object.assign(updating, {version, failure: "", late: false, since: Date.now() / 1000, step: ""});
    remember(UPDATED_KEY, version);
}

export function fail(reason) {
    updating.failure = reason;
    remember(UPDATED_KEY, "");
}

export function clear() {
    Object.assign(updating, {version: "", failure: "", late: false, since: 0, external: false, step: "", countdown: null, target: ""});
}

// Follows the server's own report of an upgrade; true once an upgrade seen running has finished.
export function follow(running, step = "") {
    if (running && step) updating.step = step;
    if (updating.version) return false;
    if (running && !updating.external) Object.assign(updating, {external: true, since: Date.now() / 1000});
    if (running || !updating.external) return false;
    clear();
    return true;
}

