import {remember, remembered} from "../platform/storage.js";
import {isWholePlan} from "../domain/plans.js";
import {ref, toRaw, watch} from "vue";
import {api, onWrite} from "../api/client.js";
import {onOutboxChange} from "../chat/outbox.js";
import {withoutAnswered} from "../domain/placeholders.js";
import {closable, isClosed, updatedAt} from "../domain/row.js";
import {TABLES} from "../domain/tables.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {PAGE, RECENT, pageOf, pageStart} from "./paging.js";

export {PAGE, RECENT, pageOf};

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
// a chat's messages come from every journal of a team, each numbering from its own block, so they go in the order they were written
const byWriting = (a, b) => String(a.created_at).localeCompare(String(b.created_at)) || a.id - b.id;
const ORDERS = {messages: byWriting};
const orderOf = (table) => ORDERS[table] || byId;

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
    const start = pageStart(table, held);
    if (start === 0) return;
    const recent = new Set(held.slice(start));
    store.rows[table] = held.filter((r) => recent.has(r) || (closable(table) && !isClosed(r)));
    store.paging.size[table] = pageOf(table);
    store.paging.more[table] = true;
}

// tables the reader is scrolled back in: a refresh adds and changes their rows but never slides the oldest out, so nothing above
// the reader moves, until the reader is back at the foot and the table is trimmed to its newest page again
const keptTables = new Set();

export const keepRows = (table) => keptTables.add(table);

export function releaseRows(table) {
    keptTables.delete(table);
    trimmed(table);
}

function forget() {
    watchedTables.forEach(trimmed);
    watchedTables.clear();
    asked.clear();
    absent.clear();
    seen.value += 1;
}

// The rows of a table with these ids, read when a page needs one it does not hold.
// rows by id are read one batch at a time per table, the read of a table's ids being one key: ids asked while a batch is in
// flight wait for it, and go in the next batch if it did not bring them
const idsRead = new Map();

export async function holding(table, ids) {
    while (idsRead.has(table)) await idsRead.get(table).catch(() => {});
    const read = heldIds(table, ids);
    idsRead.set(table, read);
    try {
        await read;
    } finally {
        if (idsRead.get(table) === read) idsRead.delete(table);
    }
}

async function heldIds(table, ids) {
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
        added(table, got.rows);
    } finally {
        missing.forEach((id) => pending.delete(id));
    }
}

// rows read apart from the table's pages, put among the rows held, a held row of the same id replaced
function added(table, fresh) {
    if (!fresh.length) return;
    const known = new Set((store.rows[table] || []).map((r) => r.id));
    store.rows[table] = [...withoutAnswered(store.rows[table] || [], fresh), ...fresh.filter((r) => !known.has(r.id))].sort(orderOf(table));
    store.paging.size[table] = store.rows[table].length;
}

// Every comment under one row, named as reports:12, read when its comments are shown and never with the row: messages like any other.
export async function readComments(ref) {
    added("messages", (await api.commentsOn(ref)).rows);
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

// A list may carry a document or report without its body, or a plan without its phases, tasks and reviews, a summary: one held whole stays whole while it has not changed.
const isSummary = (r) => ((r.table === "docs" || r.table === "reports") && !("body" in r)) || (r.table === "workers" && !("report" in r)) || (r.table === "plans" && !isWholePlan(r)) || (r.table === "reactions" && !("message_id" in r)) || (r.table === "tasks" && !("plan_id" in r));

// The rows `arriving` as the viewer keeps them against the rows it `held`: a row that has not changed is the very object it held, so
// nothing drawn from it is drawn again, as when a reconnect or a refresh reads the chat's rows again; a summary of a row held whole,
// unchanged since, stays the whole row (a plan's outline turns on its tasks' rows, so a plan is read whole again)
function stillWhole(held, arriving) {
    const known = new Map(held.filter((r) => r.id > 0).map((r) => [r.id, r]));
    return arriving.map((r) => {
        const had = known.get(r.id);
        if (!had) return r;
        if (isSummary(r) && !isSummary(had) && had.updated_at === r.updated_at && r.table !== "plans") return had;
        return JSON.stringify(had) === JSON.stringify(r) ? had : r;
    });
}

export const isWhole = (r) => !isSummary(r);

// the rows of these ids held as list rows alone, read whole in one request, as a task's plan comes only with a task read by id
export async function wholeRows(table, ids) {
    const summaries = ids.filter((id) => (store.rows[table] || []).some((r) => r.id === id && isSummary(r)));
    if (!summaries.length) return;
    const fresh = new Map((await api.list(table, {ids: summaries})).rows.map((r) => [r.id, r]));
    store.rows[table] = (store.rows[table] || []).map((r) => fresh.get(r.id) || r);
}

// one row read whole by its own endpoint, in place of its index row
export async function whole(table, id) {
    const row = await api.show(table, id);
    store.rows[table] = (store.rows[table] || []).map((r) => (r.id === id ? row : r));
}

function took(table, got) {
    loaded.add(table);
    seen.value += 1;
    const held = store.rows[table] || [];
    store.rows[table] = [...stillWhole(held, got.rows), ...withoutAnswered(held.filter((r) => r.id === 0), got.rows)];
    store.paging.size[table] = store.paging.size[table] || pageOf(table);
    store.paging.more[table] = !got.is_last_page;
}

// the rows held are in their table's order, so the oldest is the first
const oldest = (held) => {
    const closed = held.filter(isClosed);
    const listed = closed.length ? closed : held;
    return listed.length ? listed[0].id : Infinity;
};

const beforeKey = (held) => (Number.isFinite(oldest(held)) ? oldest(held) : 0);

// The newest page alone, whatever pages were held before it: a reconnect reads one page and redraws no row that has not changed.
export async function load(table) {
    const starting = new Set((store.rows[table] || []).map((r) => r.id));
    const got = await api.list(table, {limit: pageOf(table)});
    keptCounts(table, got.counts);
    const listed = new Set(got.rows.map((r) => r.id));
    const arriving = withoutAnswered((store.rows[table] || []).filter((r) => !starting.has(r.id) && !listed.has(r.id)), got.rows);
    took(table, {...got, rows: [...got.rows, ...arriving].sort(orderOf(table))});
    store.paging.size[table] = pageOf(table);
    if (READ_WHOLE.has(table)) await openWhole(table);
    return store.rows[table];
}

const keptCounts = (table, counts) => (store.counts = {...store.counts, [table]: counts});

async function caughtUp(table) {
    const held = store.rows[table] || [];
    const since = Math.max(0, ...held.map(updatedAt));
    // only the rows it holds and newer ones are asked again, never a change to a row it never loaded
    const after = held.length ? Math.min(...held.map((r) => r.id)) - 1 : 0;
    const got = await api.list(table, {limit: pageOf(table), since, after});
    keptCounts(table, got.counts);
    if (!got.is_last_page) return load(table);
    const fresh = new Map(got.rows.map((r) => [r.id, r]));
    const kept = withoutAnswered(held.filter((r) => !fresh.has(r.id)), got.rows).concat(stillWhole(held, got.rows));
    store.rows[table] = kept.sort(orderOf(table));
    store.paging.size[table] = store.rows[table].length;
    return store.rows[table];
}

// a table whose older page is being read: its refresh waits, so the two never pull at the same time
const pausedTables = new Set();

// Stops a table's refresh and settles once no read of it is in flight.
async function pausedRefresh(table) {
    pausedTables.add(table);
    while (fetching.has(table)) await draining;
}

function resumedRefresh(table) {
    pausedTables.delete(table);
    if (owed.has(table)) drain();
}

export async function earlier(...tables) {
    const growing = tables.filter((table) => store.paging.more[table]);
    await Promise.all(growing.map(olderPage));
    return growing.length > 0;
}

async function olderPage(table) {
    await pausedRefresh(table);
    try {
        await readOlderPage(table);
    } finally {
        resumedRefresh(table);
    }
}

async function readOlderPage(table) {
    const got = await api.list(table, {limit: pageOf(table), before: beforeKey(store.rows[table] || [])});
    const held = store.rows[table] || [];
    const known = new Set(held.map((r) => r.id));
    store.rows[table] = [...got.rows.filter((r) => !known.has(r.id)), ...held].sort(orderOf(table));
    store.paging.size[table] = store.rows[table].length;
    store.paging.more[table] = !got.is_last_page;
}

const closedMore = (table) => `${table}:closed`;

function addedRows(table, got) {
    const held = store.rows[table] || [];
    const known = new Set(held.map((r) => r.id));
    store.rows[table] = [...got.rows.filter((r) => !known.has(r.id)), ...held].sort(orderOf(table));
    store.paging.size[table] = store.rows[table].length;
}

export async function closedFirst(table) {
    if (closedMore(table) in store.paging.more) return;
    const got = await api.list(table, {limit: pageOf(table), closed: true});
    addedRows(table, got);
    store.paging.more[closedMore(table)] = !got.is_last_page;
}

export async function closedEarlier(table) {
    const before = (store.rows[table] || []).filter(isClosed).reduce((low, r) => Math.min(low, r.id), Infinity);
    const got = await api.list(table, {limit: pageOf(table), closed: true, before: Number.isFinite(before) ? before : 0});
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
    const got = await api.list(table, {limit: pageOf(table)});
    keptCounts(table, got.counts);
    took(table, got);
}

async function counted(table) {
    keptCounts(table, (await api.list(table, {limit: 1, closed: true})).counts);
}

// The tables whose list rows are read whole once the list has named them: the plans still open, since the bar, the board and the inspector
// draw from their phases, and every reaction, since the message a reaction sits on comes with the row read by id.
const READ_WHOLE = new Set(["plans", "reactions"]);

async function openWhole(table) {
    const ids = (store.rows[table] || []).filter((r) => isSummary(r) && (table !== "plans" || !isClosed(r))).map((r) => r.id);
    if (!ids.length) return;
    const got = await api.list(table, {ids});
    const rowsById = new Map(got.rows.map((r) => [r.id, r]));
    store.rows[table] = (store.rows[table] || []).map((r) => rowsById.get(r.id) || r);
}

// a table read before is caught up by its changes, which a refresh follows; a whole read after a break, or a first one, reads the newest page
const isPaged = (table, whole) => !loaded.has(table) || (whole && (store.paging.size[table] || pageOf(table)) === pageOf(table) && !keptTables.has(table));

async function read(table, whole) {
    if (!watchedTables.has(table)) return counted(table);
    const rows = await (isPaged(table, whole) ? paged(table) : caughtUp(table));
    if (READ_WHOLE.has(table)) await openWhole(table);
    return rows;
}

async function entriesAndSettings() {
    const [entries, settings] = await Promise.all([api.entries(0, RECENT), api.settings()]);
    keepEntries([...remembered(entriesKey(), []), ...entries]);
    if (JSON.stringify(settings) !== JSON.stringify(store.settings)) store.settings = settings;
}

const failedTable = (table, whole) =>
    read(table, whole).then(
        () => null,
        () => table
    );

async function pull(tables, whole) {
    const failed = (await Promise.all(tables.map((table) => failedTable(table, whole)))).filter(Boolean);
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
        while ([...owed].some((table) => !pausedTables.has(table)) || owedWhole) {
            const whole = owedWhole;
            const tables = [...(whole ? Object.keys(store.rows) : owed)]
                .filter((table) => TABLES[table] && (watchedTables.has(table) || table in store.rows))
                .filter((table) => whole || !watchedTables.has(table) || changed.has(table) || !loaded.has(table))
                .filter((table) => !pausedTables.has(table));
            const waiting = [...owed].filter((table) => pausedTables.has(table));
            owed.clear();
            waiting.forEach((table) => owed.add(table));
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
    } catch (refusal) {
        // a refused change is read over by the whole newest page, since a read of the changes alone would not return a row the server never changed
        loaded.delete(row.table);
        throw refusal;
    } finally {
        await refresh([row.table]);
    }
}

export function reload() {
    owedWhole = true;
    return drain();
}

const KEPT_ENTRIES = 50;
// entries kept in the browser under the name they have since their type is entry_type, so none kept under kind is read
const entriesKey = () => `typed-entries:${store.identity?.root || location.host}:${api.env()}`;

function keepEntries(entries) {
    const byEntryId = new Map(entries.map((e) => [e.id, e]));
    store.entries = [...byEntryId.values()].sort((a, b) => a.id - b.id).slice(-RECENT);
    remember(entriesKey(), store.entries.slice(-KEPT_ENTRIES));
}

export function recallEntries() {
    if (!store.entries.length) store.entries = remembered(entriesKey(), []);
}

const ROW_CHANGES = ["created", "updated", "deleted"];

// The tables a row's change touches in the viewer: a plan is shown with its phases, so a phase's change is the plans' too.
const SHOWN_AS = {phases: ["phases", "plans"]};
export const tablesOf = (table) => SHOWN_AS[table] || [table];

// The tables an entry tells the viewer to read again: a row's change names its table, a link's change the tables of the two rows it joins,
// as a task put under a plan's phase changes the plan, a setting's change the settings.
const owedBy = (e) => (!ROW_CHANGES.includes(e.entry_type) ? [] : [...tablesOf(e.data.table), ...(e.data.joins || []).flatMap(tablesOf)]);

function dropDeleted(entries) {
    for (const e of entries.filter((e) => e.entry_type === "deleted")) {
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
