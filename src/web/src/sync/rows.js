import {remember, remembered} from "../platform/storage.js";
import {ref, toRaw, watch} from "vue";
import {api, onWrite} from "../api/client.js";
import {onOutboxChange} from "../chat/outbox.js";
import {withoutAnswered} from "../domain/placeholders.js";
import {isClosed, updatedAt} from "../domain/row.js";
import {TABLES} from "../domain/tables.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {PAGE, RECENT} from "./paging.js";

export {PAGE, RECENT};

// The rows the viewer holds, by table: each table is read when a page first asks for it and caught up when the timeline
// says one of its rows was made, changed or deleted.
const watchedTables = new Set();
const seen = ref(0);
const loaded = new Set();
const changed = new Set();
const owed = new Set();
const fetching = new Set();
const asked = new Map();
const absent = new Map();
let owedWhole = false;
let draining = null;

const byId = (a, b) => a.id - b.id;

export function hasLoaded(table) {
    seen.value;
    return loaded.has(table);
}

export function rows(table) {
    seen.value;
    if (!watchedTables.has(table)) {
        watchedTables.add(table);
        if (store.booted && (!loaded.has(table) || changed.has(table))) queueMicrotask(() => refresh([table], false));
    }
    return store.rows[table] || [];
}

function trimmed(table) {
    const held = store.rows[table] || [];
    if (held.length <= PAGE) return;
    const recent = new Set(held.slice(-PAGE));
    store.rows[table] = held.filter((r) => recent.has(r) || !isClosed(r));
    store.paging.size[table] = PAGE;
    store.paging.more[table] = true;
}

function forget() {
    watchedTables.forEach(trimmed);
    watchedTables.clear();
    asked.clear();
    absent.clear();
    seen.value += 1;
}

// The rows of a table with these ids, read when a page needs one it does not hold.
export async function holding(table, ids) {
    const have = new Set((store.rows[table] || []).map((r) => r.id));
    const pending = asked.get(table) || new Set();
    const none = absent.get(table) || new Set();
    const missing = ids.filter((id) => !have.has(id) && !pending.has(id) && !none.has(id));
    if (!missing.length) return;
    missing.forEach((id) => pending.add(id));
    asked.set(table, pending);
    try {
        const got = await api.list(table, {ids: missing});
        const found = new Set(got.rows.map((r) => r.id));
        missing.filter((id) => !found.has(id)).forEach((id) => none.add(id));
        absent.set(table, none);
        if (!got.rows.length) return;
        const known = new Set((store.rows[table] || []).map((r) => r.id));
        store.rows[table] = [...withoutAnswered(store.rows[table] || [], got.rows), ...got.rows.filter((r) => !known.has(r.id))].sort(byId);
        store.paging.size[table] = store.rows[table].length;
    } finally {
        missing.forEach((id) => pending.delete(id));
    }
}

watch(() => `${route.value.env}/${route.value.page}/${route.value.open ? route.value.open.table : ""}`, forget);
watch(
    () => store.booted,
    (booted) =>
        booted &&
        refresh(
            [...watchedTables].filter((table) => !loaded.has(table)),
            false
        )
);

// A list may carry a document or report without its body, a summary: one held whole stays whole while it has not changed.
const isSummary = (r) => (r.table === "docs" || r.table === "reports") && !("body" in r);

function stillWhole(held, arriving) {
    const wholes = new Map(held.filter((r) => r.id > 0 && !isSummary(r)).map((r) => [r.id, r]));
    return arriving.map((r) => (isSummary(r) && wholes.get(r.id)?.updated_at === r.updated_at ? wholes.get(r.id) : r));
}

export const isWhole = (r) => !isSummary(r);

export async function whole(table, id) {
    const got = await api.list(table, {ids: [id]});
    const row = got.rows.find((r) => r.id === id);
    if (row) store.rows[table] = (store.rows[table] || []).map((r) => (r.id === id ? row : r));
}

function took(table, got) {
    loaded.add(table);
    seen.value += 1;
    const held = store.rows[table] || [];
    store.rows[table] = [...stillWhole(held, got.rows), ...withoutAnswered(held.filter((r) => r.id === 0), got.rows)];
    store.paging.size[table] = store.paging.size[table] || PAGE;
    store.paging.more[table] = !got.is_last_page;
}

const oldest = (held) => {
    const closed = held.filter(isClosed);
    return (closed.length ? closed : held).reduce((low, r) => Math.min(low, r.id), Infinity);
};

const beforeKey = (held) => (Number.isFinite(oldest(held)) ? oldest(held) : 0);

async function rebuilt(table, size) {
    const first = await api.list(table, {limit: PAGE});
    let rows = first.rows;
    let more = !first.is_last_page;
    while (more && rows.length < size) {
        const page = await api.list(table, {limit: PAGE, before: beforeKey(rows)});
        const known = new Set(rows.map((r) => r.id));
        const fresh = page.rows.filter((r) => !known.has(r.id));
        more = !page.is_last_page;
        if (!fresh.length) break;
        rows = [...fresh, ...rows];
    }
    return {rows, more, counts: first.counts};
}

export async function load(table) {
    const held = store.paging.size[table] || 0;
    const starting = new Set((store.rows[table] || []).map((r) => r.id));
    const got = await rebuilt(table, held);
    keptCounts(table, got.counts);
    const listed = new Set(got.rows.map((r) => r.id));
    const arriving = withoutAnswered((store.rows[table] || []).filter((r) => !starting.has(r.id) && !listed.has(r.id)), got.rows);
    took(table, {...got, rows: [...got.rows, ...arriving].sort(byId)});
    store.paging.size[table] = Math.max(held, PAGE);
    return store.rows[table];
}

const keptCounts = (table, counts) => (store.counts = {...store.counts, [table]: counts});

async function caughtUp(table) {
    const since = Math.max(0, ...(store.rows[table] || []).map(updatedAt));
    const got = await api.list(table, {limit: PAGE, since});
    keptCounts(table, got.counts);
    if (!got.is_last_page) return load(table);
    const held = store.rows[table] || [];
    const fresh = new Map(got.rows.map((r) => [r.id, r]));
    const kept = withoutAnswered(held.filter((r) => !fresh.has(r.id)), got.rows).concat(stillWhole(held, got.rows));
    store.rows[table] = kept.sort(byId);
    store.paging.size[table] = store.rows[table].length;
    return store.rows[table];
}

export async function earlier(...tables) {
    const growing = tables.filter((table) => store.paging.more[table]);
    await Promise.all(
        growing.map(async (table) => {
            const got = await api.list(table, {limit: PAGE, before: beforeKey(store.rows[table] || [])});
            const held = store.rows[table] || [];
            const known = new Set(held.map((r) => r.id));
            store.rows[table] = [...got.rows.filter((r) => !known.has(r.id)), ...held].sort(byId);
            store.paging.size[table] = store.rows[table].length;
            store.paging.more[table] = !got.is_last_page;
        })
    );
    return growing.length > 0;
}

const closedMore = (table) => `${table}:closed`;

function addedRows(table, got) {
    const held = store.rows[table] || [];
    const known = new Set(held.map((r) => r.id));
    store.rows[table] = [...got.rows.filter((r) => !known.has(r.id)), ...held].sort(byId);
    store.paging.size[table] = store.rows[table].length;
}

export async function closedFirst(table) {
    if (closedMore(table) in store.paging.more) return;
    const got = await api.list(table, {limit: PAGE, closed: true});
    addedRows(table, got);
    store.paging.more[closedMore(table)] = !got.is_last_page;
}

export async function closedEarlier(table) {
    const before = (store.rows[table] || []).filter(isClosed).reduce((low, r) => Math.min(low, r.id), Infinity);
    const got = await api.list(table, {limit: PAGE, closed: true, before: Number.isFinite(before) ? before : 0});
    addedRows(table, got);
    store.paging.more[closedMore(table)] = !got.is_last_page;
}

export const closedHasMore = (table) => Boolean(store.paging.more[closedMore(table)]);

async function fetched(tables, whole = false) {
    tables.forEach((table) => changed.delete(table));
    tables.forEach((table) => fetching.add(table));
    try {
        await pull(tables, whole);
    } finally {
        tables.forEach((table) => fetching.delete(table));
    }
}

async function paged(table) {
    const got = await api.list(table, {limit: PAGE});
    keptCounts(table, got.counts);
    took(table, got);
}

async function counted(table) {
    keptCounts(table, (await api.list(table, {limit: 1, closed: true})).counts);
}

function read(table) {
    if (!watchedTables.has(table)) return counted(table);
    return (store.paging.size[table] || PAGE) === PAGE ? paged(table) : caughtUp(table);
}

async function entriesAndSettings() {
    const [entries, settings] = await Promise.all([api.entries(0, RECENT), api.settings()]);
    keepEntries([...remembered(entriesKey(), []), ...entries]);
    store.settings = settings;
}

const failedTable = (table) =>
    read(table).then(
        () => null,
        () => table
    );

async function pull(tables, whole) {
    const failed = (await Promise.all(tables.map(failedTable))).filter(Boolean);
    failed.forEach((table) => (owed.add(table), changed.add(table)));
    if (whole) await entriesAndSettings();
    if (failed.length) throw new Error(`could not read ${failed.join(", ")}`);
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
            const tables = [...(whole ? Object.keys(store.rows) : owed)]
                .filter((table) => TABLES[table] && (watchedTables.has(table) || table in store.rows))
                .filter((table) => whole || !watchedTables.has(table) || changed.has(table) || !loaded.has(table));
            owed.clear();
            owedWhole = false;
            try {
                await fetched(tables, whole);
                retryIn = RETRY_FIRST;
            } catch (e) {
                owedWhole = owedWhole || whole;
                await new Promise((settle) => setTimeout(settle, retryIn));
                retryIn = Math.min(retryIn * 2, RETRY_LONGEST);
            }
        }
    })().finally(() => (draining = null));
    return draining;
}

export function refresh(tables, because = true) {
    tables
        .filter(Boolean)
        .filter((table) => because || !fetching.has(table))
        .forEach((table) => {
            owed.add(table);
            if (because) changed.add(table);
        });
    if (owed.has("settings")) owedWhole = true;
    return drain();
}

export async function optimistic(table, row, send) {
    store.rows[table] = [...(store.rows[table] || []), row];
    try {
        await send();
        await refresh([table]);
    } finally {
        store.rows[table] = (store.rows[table] || []).filter((r) => toRaw(r) !== row);
    }
}

export async function patched(row, change, send) {
    change(row);
    try {
        await send();
    } finally {
        await refresh([row.table]);
    }
}

export function reload() {
    owedWhole = true;
    return drain();
}

const KEPT_ENTRIES = 50;
const entriesKey = () => `entries:${location.host}:${api.env()}`;

function keepEntries(entries) {
    const byEntryId = new Map(entries.map((e) => [e.id, e]));
    store.entries = [...byEntryId.values()].sort((a, b) => a.id - b.id).slice(-RECENT);
    remember(entriesKey(), store.entries.slice(-KEPT_ENTRIES));
}

export function recallEntries() {
    if (!store.entries.length) store.entries = remembered(entriesKey(), []);
}

const ROW_CHANGES = ["created", "updated", "deleted"];

// The tables a row's change touches in the viewer: a comment is a message read through its own table, so a message's change is a comment's too.
const SHOWN_AS = {messages: ["messages", "comments"]};
export const tablesOf = (table) => SHOWN_AS[table] || [table];

// The tables an entry tells the viewer to read again: a row's change names its table, a setting's change the settings.
const owedBy = (e) => (!ROW_CHANGES.includes(e.kind) ? [] : tablesOf(e.data.table));

function dropDeleted(entries) {
    for (const e of entries.filter((e) => e.kind === "deleted")) {
        for (const table of tablesOf(e.data.table).filter((t) => store.rows[t])) {
            store.rows[table] = store.rows[table].filter((r) => r.id !== e.data.id);
        }
    }
}

export function takeEntries(entries) {
    keepEntries([...store.entries, ...entries]);
    dropDeleted(entries);
    refresh([...new Set(entries.flatMap(owedBy))].filter((table) => table && table !== "agents"));
}

onWrite((table) => store.streamOpen || refresh([table]));
onOutboxChange(() => refresh(["messages"]));
