import {waitingFor} from "../domain/agentState.js";

const NOT_WAITING = ["working", "offline", "silent"];

export function phoneWaiting(feed, now = Date.now() / 1000) {
    const live = feed.running || {};
    if (NOT_WAITING.includes(feed.agent) || live.paused) return null;
    return waitingFor(live.awaiting || {}, {helpers: live.helpers || [], now});
}
