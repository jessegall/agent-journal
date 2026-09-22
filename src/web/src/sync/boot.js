import {api} from "../api/client.js";
import {go, route} from "../route.js";
import {store, types} from "../state/store.js";
import {reload} from "./rows.js";
import {listen} from "./stream.js";

export async function boot() {
    [store.spec, store.identity] = await Promise.all([api.manifest(), api.identity()]);
    if (!route.value.env) {
        go(store.spec.environment);
        return boot();
    }
    types.value.filter((t) => t.name !== "nudge").forEach((t) => (store.rows[t.name] = store.rows[t.name] || []));
    store.pages = await api.pages();
    await reload();
    store.booted = true;
    listen();
}
