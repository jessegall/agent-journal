import {api} from "../api/client.js";
import {startOutbox} from "../chat/outbox.js";
import {wakePolls} from "../poll.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {reload, takeEvents} from "./rows.js";

const REOPEN_AFTER = 3000;
const OFFLINE_AFTER = 15000;

let source = null;
let failing = 0;

function receive(message) {
    try {
        takeEvents([JSON.parse(message.data)]);
    } catch (e) {}
}

function opened() {
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

export function listen() {
    if (source) source.close();
    store.streamOpen = false;
    startOutbox(route.value.env);
    source = api.stream();
    source.onopen = opened;
    source.onmessage = receive;
    source.onerror = failed;
}
