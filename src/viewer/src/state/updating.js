import {reactive} from "vue";
import {transport} from "../api/transport.js";
import {fieldBusy} from "../platform/busyField.js";
import {reloadForNewStart, reloadIfNewBuild} from "../windows/staleBuild.js";

const ASK_EVERY_MS = 2000;
export const LATE_AFTER_MS = 30000;

// whether the server is away, whether an install holds it, whether it has been away for longer than a restart takes, and whether this browser has no network
export const updating = reactive({starting: false, external: false, late: false, offline: false});

export const covered = () => updating.starting;

// an install restarts the server more than once, so the cover stays until the server has answered well this many times in a row
const STEADY_ANSWERS = 3;
let steadyAnswers = 0;
let asking = 0;
let lateTimer = 0;
let waiting = [];

// what the server says of itself; one that cannot be reached is still on its way back
async function stateOfServer() {
    try {
        const answer = await transport.serverState();
        return {reachable: true, ...(answer.ok ? await answer.json() : {restarting: false, updating: false})};
    } catch {
        return {reachable: false, restarting: true, updating: updating.external};
    }
}

function arrived() {
    clearInterval(asking);
    clearTimeout(lateTimer);
    asking = 0;
    Object.assign(updating, {starting: false, external: false, late: false, offline: false});
    waiting.splice(0).forEach((resolve) => resolve());
    reloadIfNewBuild();
}

// one question at a time, so a server that takes the question and never answers does not pile them up
let isAsking = false;

async function askServer() {
    updating.offline = !navigator.onLine;
    if (isAsking) return;
    isAsking = true;
    const state = await stateOfServer();
    isAsking = false;
    updating.external = state.updating;
    const isSteady = !state.restarting && !state.updating && state.reachable;
    steadyAnswers = isSteady ? steadyAnswers + 1 : 0;
    if (steadyAnswers < STEADY_ANSWERS) return;
    steadyAnswers = 0;
    const reloads = reloadForNewStart(state.started_at);
    if (!reloads || fieldBusy()) arrived();
}

// the server did not answer: the cover goes up and the server is asked until it answers again
export function serverGone() {
    if (updating.starting) return;
    updating.starting = true;
    updating.offline = !navigator.onLine;
    asking = setInterval(askServer, ASK_EVERY_MS);
    lateTimer = setTimeout(() => (updating.late = true), LATE_AFTER_MS);
}

// a broken event stream alone says nothing, as a stream also breaks with the server well: the server is asked
export async function checkServer() {
    const state = await stateOfServer();
    reloadForNewStart(state.started_at);
    if (state.restarting || state.updating) serverGone();
}

// answers once the server is back, at once when it never left
export const serverBack = () => (updating.starting ? new Promise((resolve) => waiting.push(resolve)) : Promise.resolve());
