import {api} from "../api/client.js";
import {startOutbox} from "../chat/outbox.js";
import {wakePolls} from "../poll.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {heardEvents, reload} from "./rows.js";

const REOPEN_AFTER = 3000;
const OFFLINE_AFTER = 15000;

let failing = 0;

function receive(message) {
    try {
        heardEvents([JSON.parse(message.data)]);
    } catch (e) {}
}

function opened() {
    failing = 0;
    if (store.offline) reload();
    store.offline = false;
    wakePolls();
}

function failed() {
    failing ||= Date.now();
    if (Date.now() - failing >= OFFLINE_AFTER) store.offline = true;
    if (store.stream && store.stream.readyState === EventSource.CLOSED) setTimeout(listen, REOPEN_AFTER);
}

export function listen() {
    if (store.stream) store.stream.close();
    startOutbox(route.value.env);
    store.stream = api.stream();
    store.stream.onopen = opened;
    store.stream.onmessage = receive;
    store.stream.onerror = failed;
}
