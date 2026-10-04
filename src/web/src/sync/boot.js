import {store} from "../state/store.js";
import {types} from "../domain/spec.js";
import {api} from "../api/client.js";
import {go, route} from "../route.js";
import {recallEvents, reload} from "./rows.js";
import {listen} from "./stream.js";

export async function boot() {
    [store.spec, store.identity] = await Promise.all([api.manifest(), api.identity()]);
    if (!route.value.env) {
        go(store.spec.environment);
        return boot();
    }
    types.value.filter((t) => t.name !== "nudge").forEach((t) => (store.rows[t.name] = store.rows[t.name] || []));
    recallEvents();
    store.pages = await api.pages();
    await reload();
    store.booted = true;
    listen();
}
