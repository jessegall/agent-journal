import {remember, remembered} from "../platform/storage.js";
import {ref, toRaw, watch} from "vue";
import {api, onWrite} from "../api/client.js";
import {onOutboxChange} from "../chat/outbox.js";
import {withoutAnswered} from "../domain/placeholders.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {PAGE, RECENT} from "./paging.js";

export {PAGE, RECENT};

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

export function hasLoaded(type) {
    seen.value;
    return loaded.has(type);
}

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
    store.paging.size[type] = PAGE;
    store.paging.more[type] = true;
}

function forget() {
    watchedTypes.forEach(trimmed);
    watchedTypes.clear();
    asked.clear();
    seen.value += 1;
}

async function damage(type, n) {
    try {
        await api.show(type, n);
    } catch (e) {
        if (/ is damaged: /.test(e.message)) store.damaged[`${type}:${n}`] = e.message.split(" is damaged: ").pop();
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
        const got = await api.list(type, {completed: true, only: missing});
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
        store.rows[type] = [...withoutAnswered(store.rows[type] || [], got.rows), ...got.rows.filter((r) => !known.has(r.n))].sort((a, b) => a.n - b.n);
        store.paging.size[type] = store.rows[type].length;
    } finally {
        missing.forEach((n) => pending.delete(n));
    }
}

watch(() => `${route.value.env}/${route.value.page}/${route.value.open ? route.value.open.type : ""}`, forget);
watch(
    () => store.booted,
    (booted) =>
        booted &&
        refresh(
            [...watchedTypes].filter((type) => !loaded.has(type)),
            false
        )
);

function stillWhole(held, arriving) {
    const wholes = new Map(held.filter((r) => r.n > 0 && !r.summary).map((r) => [r.n, r]));
    return arriving.map((r) => (r.summary && wholes.get(r.n)?.updated === r.updated ? wholes.get(r.n) : r));
}

export async function whole(type, n) {
    const got = await api.list(type, {completed: true, only: [n]});
    const row = got.rows.find((r) => r.n === n);
    if (row) store.rows[type] = (store.rows[type] || []).map((r) => (r.n === n ? row : r));
}

function took(type, got) {
    loaded.add(type);
    seen.value += 1;
    const held = store.rows[type] || [];
    store.rows[type] = [...stillWhole(held, got.rows), ...withoutAnswered(held.filter((r) => r.n === 0), got.rows)];
    store.paging.size[type] = store.paging.size[type] || PAGE;
    store.paging.more[type] = got.more;
}

export async function load(type) {
    const size = store.paging.size[type] || PAGE;
    const starting = new Set((store.rows[type] || []).map((r) => r.n));
    const got = await api.list(type, {last: size, completed: true});
    const listed = new Set(got.rows.map((r) => r.n));
    const arriving = withoutAnswered((store.rows[type] || []).filter((r) => !starting.has(r.n) && !listed.has(r.n)), got.rows);
    took(type, {...got, rows: [...got.rows, ...arriving].sort((a, b) => a.n - b.n)});
    store.paging.size[type] = size;
    return store.rows[type];
}

async function caughtUp(type) {
    const since = Math.max(0, ...(store.rows[type] || []).map((r) => r.updated || 0));
    const got = await api.list(type, {last: PAGE, completed: true, since});
    if (got.more) return load(type);
    const held = store.rows[type] || [];
    const fresh = new Map(got.rows.map((r) => [r.n, r]));
    const kept = withoutAnswered(held.filter((r) => !fresh.has(r.n)), got.rows).concat(got.rows.filter((r) => !r.deleted));
    store.rows[type] = kept.sort((a, b) => a.n - b.n);
    store.paging.size[type] = store.rows[type].length;
    return store.rows[type];
}

export async function earlier(...types) {
    const growing = types.filter((type) => store.paging.more[type]);
    await Promise.all(
        growing.map(async (type) => {
            const starting = store.rows[type] || [];
            const closed = starting.filter((r) => r.completed);
            const before = (closed.length ? closed : starting).reduce((low, r) => Math.min(low, r.n), Infinity);
            const got = await api.list(type, {last: PAGE, completed: true, before: Number.isFinite(before) ? before : 0});
            const held = store.rows[type] || [];
            const known = new Set(held.map((r) => r.n));
            store.rows[type] = [...got.rows.filter((r) => !known.has(r.n)), ...held].sort((a, b) => a.n - b.n);
            store.paging.size[type] = store.rows[type].length;
            store.paging.more[type] = got.more;
        })
    );
    return growing.length > 0;
}

const closedMore = (type) => `${type}:closed`;

function addedRows(type, got) {
    const held = store.rows[type] || [];
    const known = new Set(held.map((r) => r.n));
    store.rows[type] = [...got.rows.filter((r) => !known.has(r.n)), ...held].sort((a, b) => a.n - b.n);
    store.paging.size[type] = store.rows[type].length;
}

export async function closedFirst(type) {
    if (closedMore(type) in store.paging.more) return;
    const got = await api.list(type, {last: PAGE, closed: true});
    addedRows(type, got);
    store.paging.more[closedMore(type)] = got.more;
}

export async function closedEarlier(type) {
    const before = (store.rows[type] || []).filter((r) => r.completed).reduce((low, r) => Math.min(low, r.n), Infinity);
    const got = await api.list(type, {last: PAGE, closed: true, before: Number.isFinite(before) ? before : 0});
    addedRows(type, got);
    store.paging.more[closedMore(type)] = got.more;
}

export const closedHasMore = (type) => Boolean(store.paging.more[closedMore(type)]);

async function fetched(types, whole = false) {
    types.forEach((type) => changed.delete(type));
    types.forEach((type) => fetching.add(type));
    try {
        await pull(types, whole);
    } finally {
        types.forEach((type) => fetching.delete(type));
    }
}

async function pull(types, whole) {
    const plain = types.filter((type) => (store.paging.size[type] || PAGE) === PAGE);
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

const RETRY_FIRST = 1000;
const RETRY_LONGEST = 15000;
let retryIn = RETRY_FIRST;

async function drain() {
    if (draining) return draining;
    draining = (async () => {
        await new Promise((settle) => setTimeout(settle, 30));
        while (owed.size || owedWhole) {
            const whole = owedWhole;
            const types = [...(whole ? Object.keys(store.rows) : owed)]
                .filter((type) => watchedTypes.has(type))
                .filter((type) => whole || changed.has(type) || !loaded.has(type));
            owed.clear();
            owedWhole = false;
            try {
                await fetched(types, whole);
                retryIn = RETRY_FIRST;
            } catch (e) {
                types.forEach((type) => (owed.add(type), changed.add(type)));
                owedWhole = owedWhole || whole;
                await new Promise((settle) => setTimeout(settle, retryIn));
                retryIn = Math.min(retryIn * 2, RETRY_LONGEST);
            }
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
        store.rows[type] = (store.rows[type] || []).filter((r) => toRaw(r) !== row);
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

const owedBy = (e) => (e.data && e.data.setting ? "settings" : e.type);

const notResources = new Set();
const unknown = (e) => !store.spec.types[e.type] && !notResources.has(e.type);

export async function takeEvents(events) {
    if (!store.spec || events.some(unknown)) {
        store.spec = await api.manifest();
        events.filter((e) => !store.spec.types[e.type]).forEach((e) => notResources.add(e.type));
    }
    keepEvents([...store.events, ...events]);
    refresh([...new Set(events.map(owedBy))].filter((type) => type !== "agent"));
}

onWrite((type) => store.streamOpen || refresh([type]));
onOutboxChange(() => refresh(["message"]));
