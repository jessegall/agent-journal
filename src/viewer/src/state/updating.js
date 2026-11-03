import {reactive} from "vue";

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

const locked = () => Boolean(updating.version || updating.external) && !updating.failure && !updating.late;

// Whether the update cover is up: counting down to an update, or one under way.
export const covered = () => Boolean(updating.countdown) || locked() || updating.starting;

function clear() {
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

