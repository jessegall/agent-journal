import {api} from "../api/client.js";
import {startOutbox} from "../chat/outbox.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {heardEvents} from "./rows.js";

function heard(message) {
    try {
        heardEvents([JSON.parse(message.data)]);
    } catch (e) {}
}

export function listen() {
    if (store.stream) store.stream.close();
    startOutbox(route.value.env);
    store.stream = api.stream();
    store.stream.onmessage = heard;
}
