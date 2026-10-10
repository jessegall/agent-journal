import {store} from "../state/store.js";
import {types} from "../domain/spec.js";
import {api} from "../api/client.js";
import {go, route} from "../route.js";
import {load, recallEvents, reload} from "./rows.js";
import {listen} from "./stream.js";

export async function boot() {
    const messages = route.value.env ? load("message") : null;
    [store.spec, store.identity, store.pages] = await Promise.all([api.manifest(), api.identity(), api.pages()]);
    if (!route.value.env) {
        go(store.spec.environment);
        return boot();
    }
    types.value.filter((t) => t.name !== "nudge").forEach((t) => (store.rows[t.name] = store.rows[t.name] || []));
    recallEvents();
    await messages;
    store.booted = true;
    listen();
    await reload();
}
