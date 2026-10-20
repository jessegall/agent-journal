import {onPhone} from "../platform/phone.js";
import {api} from "../api/client.js";
import {startOutbox} from "../chat/outbox.js";
import {wakePolls} from "../composables/poll.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {reload, takeEntries} from "./rows.js";

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
        if (store.streamOpen && Date.now() - heardAt >= SILENT_AFTER) listen();
    }, WATCH_EVERY);
}

function opened() {
    heard();
    failing = 0;
    store.streamOpen = true;
    if (store.offline) reload();
    store.offline = false;
    wakePolls();
}

function failed() {
    store.streamOpen = false;
    failing ||= Date.now();
    if (Date.now() - failing >= OFFLINE_AFTER) store.offline = true;
    if (source && source.readyState === EventSource.CLOSED) setTimeout(listen, REOPEN_AFTER);
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
    asking = setInterval(askAgain, ASK_EVERY);
}

export function listen() {
    if (onPhone) return poll();
    if (source) source.close();
    store.streamOpen = false;
    startOutbox(route.value.env);
    source = api.stream();
    source.onopen = opened;
    source.onmessage = receive;
    source.addEventListener("beat", heard);
    watchSilence();
    source.onerror = failed;
}
