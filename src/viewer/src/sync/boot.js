import {store} from "../state/store.js";
import {choose} from "../state/environment.js";
import {tables} from "../domain/tables.js";
import {api} from "../api/client.js";
import {knowPages, PAGES, route} from "../route.js";
import {load, recallEntries, reload, rows} from "./rows.js";
import {listen} from "./stream.js";

const isPage = (name) => PAGES.includes(name) || tables.value.some((t) => t.name === name);

function adoptAsked() {
    const params = new URLSearchParams(location.search);
    const asked = params.get("env");
    if (!asked) return;
    choose(asked);
    params.delete("env");
    const rest = params.toString();
    history.replaceState(null, "", `${location.pathname}${rest ? `?${rest}` : ""}${location.hash}`);
}

const exists = (name) => rows("environments").some((e) => e.name === name);

// a tab remembering an environment that is gone, or none, opens on the first one the journal has
const known = (name) => Boolean(name) && (store.identity?.environments || []).includes(name);

export async function boot() {
    adoptAsked();
    [store.spec, store.identity] = await Promise.all([api.manifest(), api.identity()]);
    knowPages(isPage);
    if (!known(route.value.env)) {
        choose(store.spec.environment);
        return store.spec.environment ? boot() : undefined;
    }
    const messages = load("messages");
    tables.value.filter((t) => t.name !== "nudges").forEach((t) => (store.rows[t.name] = store.rows[t.name] || []));
    recallEntries();
    await messages;
    store.booted = true;
    listen();
    await reload();
    if (!exists(route.value.env)) choose(store.spec.environment);
}
