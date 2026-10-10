import {reactive} from "vue";
import {remember, remembered} from "../platform/storage.js";

export const UPDATED_KEY = "journal.updated.to";
export const STEPS = ["Installing the new version", "Restarting the journal", "Loading the new version"];
const SECOND_STEP_AT = 8;
const THIRD_STEP_AT = 25;

export const updating = reactive({version: "", failure: "", late: false, since: 0, external: false, step: "", countdown: null, target: "", starting: false});

export const stepAt = (seconds) => (seconds < SECOND_STEP_AT ? STEPS[0] : seconds < THIRD_STEP_AT ? STEPS[1] : STEPS[2]);
export const locked = () => Boolean(updating.version || updating.external) && !updating.failure && !updating.late;

// Whether the update cover is up: counting down to an update, or one under way.
export const covered = () => Boolean(updating.countdown) || locked() || updating.starting;

// The server says whether it has booted and is ready; an older server says nothing, which leaves the page as it is.
export const starting = (ready) => (updating.starting = ready === false);

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

export function runLate() {
    updating.late = true;
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

export const updatedTo = () => remembered(UPDATED_KEY, "");
export const forgetUpdate = () => remember(UPDATED_KEY, "");

// A page loaded while the server upgrades is told so in its own head, so the cover is up before anything is asked of a half-restarted server.
export function followPage(page) {
    const marked = page.querySelector('meta[name="journal-updating"]');
    if (marked) follow(true, marked.getAttribute("content") || "");
}
