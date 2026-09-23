import {reactive, ref, watch} from "vue";
import {api, onWrite} from "../api/client.js";
import {remember, remembered} from "../composables/remembered.js";
import {onOutboxChange} from "../chat/outbox.js";
import {report} from "../faults.js";
import {route} from "../route.js";
import {store} from "../state/store.js";

export const PAGE = 25;
export const RECENT = 100;
export const paging = reactive({size: {}, more: {}});

const watchedTypes = new Set();
const seen = ref(0);
const loaded = new Set();
const changed = new Set();
const owed = new Set();
const fetching = new Set();
const asked = new Map();
const absent = new Map();
let owedWhole = false;
let draining = null;

export function rows(type) {
    seen.value;
    if (!watchedTypes.has(type)) {
        watchedTypes.add(type);
        if (store.booted && (!loaded.has(type) || changed.has(type))) queueMicrotask(() => refresh([type], false));
    }
    return store.rows[type] || [];
}

function trimmed(type) {
    const held = store.rows[type] || [];
    if (held.length <= PAGE) return;
    const recent = new Set(held.slice(-PAGE));
    store.rows[type] = held.filter((r) => recent.has(r) || !r.completed);
    paging.size[type] = PAGE;
    paging.more[type] = true;
}

function forget() {
    watchedTypes.forEach(trimmed);
    watchedTypes.clear();
    asked.clear();
    seen.value += 1;
}

export const damaged = reactive({});

async function damage(type, n) {
    try {
        await api.show(type, n);
    } catch (e) {
        if (/ is damaged: /.test(e.message)) damaged[`${type}:${n}`] = e.message.split(" is damaged: ").pop();
    }
}

export async function holding(type, numbers) {
    const have = new Set((store.rows[type] || []).map((r) => r.n));
    const pending = asked.get(type) || new Set();
    const none = absent.get(type) || new Set();
    const missing = numbers.filter((n) => !have.has(n) && !pending.has(n) && !none.has(n));
    if (!missing.length) return;
    missing.forEach((n) => pending.add(n));
    asked.set(type, pending);
    try {
        const got = await api.list(type, {completed: true, only: missing}).catch(() => ({rows: []}));
        const found = new Set(got.rows.map((r) => r.n));
        missing
            .filter((n) => !found.has(n))
            .forEach((n) => {
                none.add(n);
                damage(type, n);
            });
        absent.set(type, none);
        if (!got.rows.length) return;
        const known = new Set((store.rows[type] || []).map((r) => r.n));
        store.rows[type] = [...(store.rows[type] || []), ...got.rows.filter((r) => !known.has(r.n))].sort((a, b) => a.n - b.n);
        paging.size[type] = store.rows[type].length;
    } finally {
        missing.forEach((n) => pending.delete(n));
    }
}

watch(() => `${route.value.env}/${route.value.page}/${route.value.open ? route.value.open.type : ""}`, forget);
watch(
    () => route.value.env,
    () => loaded.clear()
);
watch(
    () => store.booted,
    (booted) =>
        booted &&
        refresh(
            [...watchedTypes].filter((type) => !loaded.has(type)),
            false
        )
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
            const closed = held.filter((r) => r.completed);
            const before = (closed.length ? closed : held).reduce((low, r) => Math.min(low, r.n), Infinity);
            const got = await api.list(type, {last: PAGE, completed: true, before: Number.isFinite(before) ? before : 0});
            const known = new Set(held.map((r) => r.n));
            store.rows[type] = [...got.rows.filter((r) => !known.has(r.n)), ...held].sort((a, b) => a.n - b.n);
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
    types.forEach((type) => fetching.add(type));
    try {
        await pull(types, whole);
    } finally {
        types.forEach((type) => fetching.delete(type));
    }
}

async function pull(types, whole) {
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
        keepEvents([...remembered(eventsKey(), []), ...got.events]);
        store.settings = got.settings;
    }
}

async function drain() {
    if (draining) return draining;
    draining = (async () => {
        await new Promise((settle) => setTimeout(settle, 30));
        while (owed.size || owedWhole) {
            const whole = owedWhole;
            const types = [...(whole ? Object.keys(store.rows) : owed)].filter((type) => watchedTypes.has(type));
            owed.clear();
            owedWhole = false;
            await fetched(types, whole);
        }
    })().finally(() => (draining = null));
    return draining;
}

export function refresh(types, because = true) {
    types
        .filter(Boolean)
        .filter((type) => because || !fetching.has(type))
        .forEach((type) => {
            owed.add(type);
            if (because) changed.add(type);
        });
    if (owed.has("settings")) owedWhole = true;
    return drain();
}

export async function optimistic(type, row, send) {
    store.rows[type] = [...(store.rows[type] || []), row];
    try {
        await send();
        await refresh([type]);
    } finally {
        store.rows[type] = (store.rows[type] || []).filter((r) => r !== row);
    }
}

export async function patched(row, change, send) {
    change(row);
    try {
        await send();
    } finally {
        await refresh([row.type]);
    }
}

export function reload() {
    owedWhole = true;
    return drain();
}

const KEPT_EVENTS = 50;
const eventsKey = () => `events:${location.host}:${api.env()}`;

function keepEvents(events) {
    const byId = new Map(events.map((e) => [e.id, e]));
    store.events = [...byId.values()].sort((a, b) => a.id - b.id).slice(-RECENT);
    remember(eventsKey(), store.events.slice(-KEPT_EVENTS));
}

export function recallEvents() {
    if (!store.events.length) store.events = remembered(eventsKey(), []);
}

export async function heardEvents(events) {
    if (!store.spec || events.some((e) => !store.spec.types[e.type])) store.spec = await api.manifest();
    keepEvents([...store.events, ...events]);
    refresh([...new Set(events.map((e) => e.type))].filter((type) => type !== "agent"));
}

onWrite((type) => refresh([type]));
onOutboxChange(() => refresh(["message"]));
