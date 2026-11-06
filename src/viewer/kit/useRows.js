import {afterSkeletonMinimum} from "./skeletonMinimum.js";
import {ref} from "vue";
import {useWindow} from "./windowContextKey.js";
import {runChanged} from "./runChanged.js";

// the rows a window lists from one read line (in a share, the one row it is shared for, read by its model's show line), read again whenever an event it follows arrives, with the reason a read
// failed in place of the rows, and whether the first read has answered
// whether the server says another page follows the one it answered
const CHANGE_JOIN_MS = 50;
const followed = (page, size) => "total" in page ? page.page * page.size < page.total : page.rows.length >= size;

export function useDeclaredRows(key) {
    const source = useWindow().sources.find((source) => source.key === key);
    return source ? useRows(source.read, source.events) : useRows("", []);
}

export function rowList(context, askRows, pageSizeOf, isIncremental, readsIds = () => false) {
    const rows = ref([]);
    const listing = ref(null);
    const failure = ref("");
    const loaded = ref(false);
    const startedAt = performance.now();
    const more = ref(false);
    const actionFailure = ref("");
    const answer = ref(null);

    // the rows that changed within one moment are read together by their ids, so one on an older page is kept up to date too;
    // a row that does not come back no longer lists and leaves
    const changedIds = new Set();
    let changedRead = null;
    function changed(id) {
        if (!readsIds()) return changedAlone(id);
        changedIds.add(id);
        return (changedRead ??= new Promise((resolve) => setTimeout(() => resolve(readChanged()), CHANGE_JOIN_MS)));
    }

    async function readChanged() {
        const ids = new Set(changedIds);
        changedIds.clear();
        changedRead = null;
        const turn = latestLoad;
        const result = await askRows({ids: [...ids].join(","), limit: ids.size});
        if (turn !== latestLoad) return;
        if (!result.ok) return load();
        const answered = new Map(result.value.rows.map((row) => [row.id, row]));
        rows.value = rows.value.flatMap((held) => (!ids.has(held.id) ? [held] : (answered.has(held.id) ? [answered.get(held.id)] : [])));
    }

    // a changed row is read alone where its read cannot list by ids
    async function changedAlone(id) {
        const turn = latestLoad;
        const result = await askRows({"before-id": id + 1, limit: 1});
        if (turn !== latestLoad) return;
        if (!result.ok) return load();
        const row = result.value.rows.find((listed) => listed.id === id);
        rows.value = row ? rows.value.map((held) => (held.id === id ? row : held)) : rows.value.filter((held) => held.id !== id);
    }

    // a created row is asked for alone, after the newest one held; a held row that changed is read alone; anything else reads the page again
    async function heard(event) {
        if (isIncremental() && String(event?.event ?? "").endsWith(".delete")) return void (rows.value = rows.value.filter((row) => row.id !== event.row_id));
        if (isIncremental() && event?.row_id && !String(event.event ?? "").endsWith(".create") && rows.value.some((row) => row.id === event.row_id)) return changed(event.row_id);
        const created = isIncremental() && rows.value.length && String(event?.event ?? "").endsWith(".create");
        if (!created) return load();
        const newest = Math.max(...rows.value.map((row) => row.id));
        const turn = latestLoad;
        const result = await askRows({"after-id": newest});
        if (turn !== latestLoad) return;
        if (!result.ok) return load();
        const held = new Set(rows.value.map((row) => row.id));
        rows.value = [...result.value.rows.filter((row) => !held.has(row.id)), ...rows.value];
    }

    // the page of rows older than the oldest held, added behind them; false when there are none, and `more` says whether the server holds another page behind it
    async function older() {
        if (!more.value || !rows.value.length) return false;
        const turn = latestLoad;
        const oldest = Math.min(...rows.value.map((row) => row.id));
        const result = await askRows({"before-id": oldest});
        if (turn !== latestLoad) return false;
        if (!result.ok || !result.value.rows.length) return (more.value = false);
        more.value = followed(result.value, pageSizeOf());
        const held = new Set(rows.value.map((row) => row.id));
        rows.value = [...rows.value, ...result.value.rows.filter((row) => !held.has(row.id))];
        return true;
    }

    let latestLoad = 0;
    function showPage(result, take) {
        const fresh = result.ok ? (context.shared ? [result.value] : (result.value?.rows ?? [])) : [];
        // a read that failed keeps the rows held: it says nothing about them
        if (result.ok) rows.value = take(fresh);
        listing.value = result.ok ? result.value : null;
        const reach = fresh.length ? Math.min(...fresh.map((row) => row.id)) : 0;
        if (result.ok && result.value?.rows && !rows.value.some((row) => row.id < reach)) more.value = !context.shared && followed(result.value, pageSizeOf());
        failure.value = result.ok ? "" : result.error;
        afterSkeletonMinimum(startedAt, () => (loaded.value = true));
    }

    async function readPage(take) {
        const turn = ++latestLoad;
        const result = await askRows({});
        if (turn === latestLoad) showPage(result, take);
    }

    const merged = (fresh) => {
        if (!isIncremental() || !fresh.length) return fresh;
        const reach = Math.min(...fresh.map((row) => row.id));
        const newest = Math.max(...fresh.map((row) => row.id));
        return [...rows.value.filter((row) => row.id > newest), ...fresh, ...rows.value.filter((row) => row.id < reach)];
    };
    const load = () => readPage(merged);
    const showFirst = (result) => showPage(result, merged);

    const loadLatest = () => readPage((fresh) => fresh);

    // runs a command the window declares, keeps what it answered or why it failed, and reads the rows again; a change, from the rows held to
    // the rows the command will leave, shows at once, and is put back with the reason when the command fails
    async function act(words, change = null) {
        const result = await runChanged(change && {target: rows, fields: {value: change(rows.value)}}, words, context.run);
        actionFailure.value = result.ok ? "" : result.error;
        answer.value = result.ok ? result.value : null;
        await load();
        return result;
    }

    return {rows, listing, failure, loaded, more, load, loadLatest, older, act, actionFailure, answer, context, heard, showFirst};
}

const flagWords = (flags) => Object.entries(flags).map(([name, value]) => ` --${name} ${value}`).join("");

export function useRows(line, patterns, {incremental = false} = {}) {
    const pageSize = Number(line.match(/--limit[=\s]+(\d+)/)?.[1] ?? 50);
    const context = useWindow();
    const askRows = (flags) => context.read(context.shared && !Object.keys(flags).length ? `${context.shared.model} show ${context.shared.id}` : `${line}${flagWords(flags)}`);
    const list = rowList(context, askRows, () => pageSize, () => incremental);
    if (line) {
        context.follow(patterns, list.heard);
        list.load();
    }
    return list;
}
