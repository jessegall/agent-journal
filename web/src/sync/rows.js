import {reactive, watch} from "vue";
import {api, onWrite} from "../api/client.js";
import {onOutboxChange} from "../chat/outbox.js";
import {report} from "../faults.js";
import {route} from "../route.js";
import {store} from "../state/store.js";

export const PAGE = 25;
export const RECENT = 100;
export const paging = reactive({size: {}, more: {}});

const shown = new Set();
const loaded = new Set();
const changed = new Set();
const owed = new Set();
let owedWhole = false;
let draining = null;

export function rows(type) {
    if (!shown.has(type)) {
        shown.add(type);
        if (store.booted && (!loaded.has(type) || changed.has(type))) queueMicrotask(() => refresh([type], false));
    }
    return store.rows[type] || [];
}

function trimmed(type) {
    const held = store.rows[type] || [];
    if (held.length <= PAGE) return;
    store.rows[type] = held.slice(-PAGE);
    paging.size[type] = PAGE;
    paging.more[type] = true;
}

function forget() {
    shown.forEach(trimmed);
    shown.clear();
}

watch(() => `${route.value.env}/${route.value.page}/${route.value.open ? route.value.open.type : ""}`, forget);
watch(
    () => route.value.env,
    () => loaded.clear()
);

function took(type, got) {
    loaded.add(type);
    store.rows[type] = got.rows;
    paging.size[type] = paging.size[type] || PAGE;
    paging.more[type] = got.more;
}

export async function load(type) {
    const size = paging.size[type] || PAGE;
    took(type, await api.list(type, {last: size, completed: true}));
    paging.size[type] = size;
    return store.rows[type];
}

async function caughtUp(type) {
    const held = store.rows[type] || [];
    const since = Math.max(0, ...held.map((r) => r.updated || 0));
    const got = await api.list(type, {last: PAGE, completed: true, since});
    if (got.more) return load(type);
    const fresh = new Map(got.rows.map((r) => [r.n, r]));
    const kept = held.filter((r) => !fresh.has(r.n)).concat(got.rows.filter((r) => !r.deleted));
    store.rows[type] = kept.sort((a, b) => a.n - b.n);
    paging.size[type] = store.rows[type].length;
    return store.rows[type];
}

export async function earlier(...types) {
    const growing = types.filter((type) => paging.more[type]);
    await Promise.all(
        growing.map(async (type) => {
            const held = store.rows[type] || [];
            const got = await api.list(type, {last: PAGE, completed: true, before: held.length ? held[0].n : 0});
            store.rows[type] = [...got.rows, ...held];
            paging.size[type] = store.rows[type].length;
            paging.more[type] = got.more;
        })
    );
    return growing.length > 0;
}

function unasked(types) {
    types
        .filter((type) => loaded.has(type) && !changed.has(type))
        .forEach((type) => report("refetch", `${type} was fetched again with nothing changed`, type));
    types.forEach((type) => changed.delete(type));
}

async function fetched(types, whole = false) {
    if (!whole) unasked(types);
    const plain = types.filter((type) => (paging.size[type] || PAGE) === PAGE);
    const sized = types.filter((type) => !plain.includes(type));
    const [got] = await Promise.all([
        plain.length || whole ? api.dashboard(plain, {last: PAGE, events: whole ? RECENT : null}) : null,
        ...sized.map(caughtUp),
    ]);
    if (!got) return;
    store.counts = {...store.counts, ...got.counts};
    Object.entries(got.rows).forEach(([type, listed]) => took(type, listed));
    if (whole) {
        store.events = got.events;
        store.settings = got.settings;
    }
}

async function drain() {
    if (draining) return draining;
    draining = (async () => {
        await new Promise((settle) => setTimeout(settle, 30));
        while (owed.size || owedWhole) {
            const whole = owedWhole;
            const types = [...(whole ? Object.keys(store.rows) : owed)].filter((type) => shown.has(type));
            owed.clear();
            owedWhole = false;
            await fetched(types, whole);
        }
    })().finally(() => (draining = null));
    return draining;
}

export function refresh(types, because = true) {
    types.filter(Boolean).forEach((type) => {
        owed.add(type);
        if (because) changed.add(type);
    });
    if (owed.has("settings")) owedWhole = true;
    return drain();
}

export function reload() {
    owedWhole = true;
    return drain();
}

export function heardEvents(events) {
    store.events = [...store.events, ...events].slice(-RECENT);
    refresh([...new Set(events.map((e) => e.type))].filter((type) => type !== "agent"));
}

onWrite((type) => refresh([type]));
onOutboxChange(() => refresh(["message"]));
