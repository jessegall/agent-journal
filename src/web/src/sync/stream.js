import {api} from "../api/client.js";
import {startOutbox} from "../chat/outbox.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {heardEvents} from "./rows.js";

function receive(message) {
    try {
        heardEvents([JSON.parse(message.data)]);
    } catch (e) {}
}

export function listen() {
    if (store.stream) store.stream.close();
    startOutbox(route.value.env);
    store.stream = api.stream();
    store.stream.onmessage = receive;
    store.stream.onerror = () => {
        if (store.stream && store.stream.readyState === EventSource.CLOSED) setTimeout(listen, REOPEN_AFTER);
    };
}

const REOPEN_AFTER = 3000;
