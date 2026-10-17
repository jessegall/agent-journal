import {store} from "../state/store.js";
import {choose} from "../state/environment.js";
import {types} from "../domain/spec.js";
import {api} from "../api/client.js";
import {knowPages, PAGES, route} from "../route.js";
import {load, recallEvents, reload, rows} from "./rows.js";
import {listen} from "./stream.js";

const isPage = (name) => PAGES.includes(name) || Boolean(store.spec.types[name]);

function adoptAsked() {
    const params = new URLSearchParams(location.search);
    const asked = params.get("env");
    if (!asked) return;
    choose(asked);
    params.delete("env");
    const rest = params.toString();
    history.replaceState(null, "", `${location.pathname}${rest ? `?${rest}` : ""}${location.hash}`);
}

const exists = (name) => rows("environment").some((e) => e.title === name && !e.deleted);

export async function boot() {
    adoptAsked();
    const messages = route.value.env ? load("message") : null;
    [store.spec, store.identity, store.pages] = await Promise.all([api.manifest(), api.identity(), api.pages()]);
    knowPages(isPage);
    if (!route.value.env) {
        choose(store.spec.environment);
        return boot();
    }
    types.value.filter((t) => t.name !== "nudge").forEach((t) => (store.rows[t.name] = store.rows[t.name] || []));
    recallEvents();
    await messages;
    store.booted = true;
    listen();
    await reload();
    if (!exists(route.value.env)) choose(store.spec.environment);
}
