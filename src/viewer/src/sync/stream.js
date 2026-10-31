import {onPhone} from "../platform/phone.js";
import {api} from "../api/client.js";
import {startOutbox} from "../chat/outbox.js";
import {wakePolls} from "../composables/poll.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {reload, takeEntries} from "./rows.js";
import {STREAM_CLOSED} from "../api/transport.js";

const REOPEN_AFTER = 3000;
const OFFLINE_AFTER = 15000;
const SILENT_AFTER = 45000;
const WATCH_EVERY = 5000;

let source = null;
let failing = 0;
let heardAt = 0;
let watching = 0;

const heard = () => (heardAt = Date.now());

function receive(message) {
    heard();
    try {
        takeEntries([JSON.parse(message.data)]);
    } catch (e) {
        reload();
    }
}

function watchSilence() {
    clearInterval(watching);
    watching = setInterval(() => {
        if (!store.streamOpen || Date.now() - heardAt < SILENT_AFTER) return;
        failing ||= Date.now();
        listen();
    }, WATCH_EVERY);
}

// A stream opened after a failing one may have missed entries in between, however short the break, so the rows are read again;
// and the journal behind this address may be another one now, since journals take free ports in turn, so the page starts afresh.
async function sameJournal() {
    const now = await api.identity();
    if (store.identity && now.root !== store.identity.root) window.location.reload();
}

function opened() {
    heard();
    if (failing) {
        reload();
        sameJournal();
    }
    failing = 0;
    store.streamOpen = true;
    store.offline = false;
    wakePolls();
}

function failed() {
    store.streamOpen = false;
    failing ||= Date.now();
    if (Date.now() - failing >= OFFLINE_AFTER) store.offline = true;
    if (source && source.readyState === STREAM_CLOSED) setTimeout(listen, REOPEN_AFTER);
}

// The phone has no stream through the tunnel's listener: it asks for the entries after the last it took instead.
const ASK_EVERY = 3000;
let asking = 0;

async function askAgain() {
    const since = Math.max(0, ...store.entries.map((e) => e.id));
    try {
        takeEntries(await api.entries(since));
        store.offline = false;
    } catch (e) {
        store.offline = true;
    }
}

function poll() {
    clearInterval(asking);
    startOutbox(route.value.env);
    store.streamOpen = false;
    askAgain();
    asking = setInterval(askAgain, ASK_EVERY);
}

// A hidden tab holds no stream and asks for no entries; shown again it opens the stream after the newest entry it holds.
function hush() {
    clearInterval(watching);
    clearInterval(asking);
    if (source) source.close();
    source = null;
    store.streamOpen = false;
}

document.addEventListener("visibilitychange", () => listen());

// The stream starts after the newest entry the page holds, so a change made while it was away or reconnecting is sent, not skipped.
export function listen() {
    if (document.hidden) return hush();
    if (onPhone) return poll();
    if (source) source.close();
    store.streamOpen = false;
    startOutbox(route.value.env);
    source = api.stream(Math.max(0, ...store.entries.map((e) => e.id)));
    source.onopen = opened;
    source.onmessage = receive;
    source.addEventListener("beat", heard);
    watchSilence();
    source.onerror = failed;
}
