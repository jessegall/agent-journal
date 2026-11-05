import {afterSkeletonMinimum} from "./skeletonMinimum.js";
import {ref} from "vue";
import {useWindow} from "./windowContextKey.js";
import {runChanged} from "./runChanged.js";

// the rows a window lists from one read line (in a share, the one row it is shared for, read by its model's show line), read again whenever an event it follows arrives, with the reason a read
// failed in place of the rows, and whether the first read has answered
// whether the server says another page follows the one it answered
const followed = (page, size) => "total" in page ? page.page * page.size < page.total : page.rows.length >= size;

export function useDeclaredRows(key) {
    const source = useWindow().sources.find((source) => source.key === key);
    return source ? useRows(source.read, source.events) : useRows("", []);
}

export function useRows(line, patterns, {incremental = false} = {}) {
    const pageSize = Number(line.match(/--limit[=\s]+(\d+)/)?.[1] ?? 50);
    const context = useWindow();
    const rows = ref([]);
    const listing = ref(null);
    const failure = ref("");
    const loaded = ref(false);
    const startedAt = performance.now();
    const more = ref(false);
    const actionFailure = ref("");
    const answer = ref(null);

    // a changed row is read alone, so one on an older page is kept up to date too; one that no longer lists leaves
    async function changed(id) {
        const turn = latestLoad;
        const result = await context.read(`${line} --before-id ${id + 1} --limit 1`);
        if (turn !== latestLoad) return;
        if (!result.ok) return load();
        const row = result.value.rows.find((listed) => listed.id === id);
        rows.value = row ? rows.value.map((held) => (held.id === id ? row : held)) : rows.value.filter((held) => held.id !== id);
    }

    // a created row is asked for alone, after the newest one held; a held row that changed is read alone; anything else reads the page again
    async function heard(event) {
        if (incremental && String(event?.event ?? "").endsWith(".delete")) return void (rows.value = rows.value.filter((row) => row.id !== event.row_id));
        if (incremental && event?.row_id && !String(event.event ?? "").endsWith(".create") && rows.value.some((row) => row.id === event.row_id)) return changed(event.row_id);
        const created = incremental && rows.value.length && String(event?.event ?? "").endsWith(".create");
        if (!created) return load();
        const newest = Math.max(...rows.value.map((row) => row.id));
        const turn = latestLoad;
        const result = await context.read(`${line} --after-id ${newest}`);
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
        const result = await context.read(`${line} --before-id ${oldest}`);
        if (turn !== latestLoad) return false;
        if (!result.ok || !result.value.rows.length) return (more.value = false);
        more.value = followed(result.value, pageSize);
        const held = new Set(rows.value.map((row) => row.id));
        rows.value = [...rows.value, ...result.value.rows.filter((row) => !held.has(row.id))];
        return true;
    }

    let latestLoad = 0;
    async function readPage(take) {
        const turn = ++latestLoad;
        const result = await context.read(context.shared ? `${context.shared.model} show ${context.shared.id}` : line);
        if (turn !== latestLoad) return;
        const fresh = result.ok ? (context.shared ? [result.value] : result.value.rows) : [];
        rows.value = take(fresh);
        listing.value = result.ok ? result.value : null;
        const reach = fresh.length ? Math.min(...fresh.map((row) => row.id)) : 0;
        if (result.ok && !rows.value.some((row) => row.id < reach)) more.value = !context.shared && followed(result.value, pageSize);
        failure.value = result.ok ? "" : result.error;
        afterSkeletonMinimum(startedAt, () => (loaded.value = true));
    }

    function load() {
        return readPage((fresh) => {
            if (!incremental || !fresh.length) return fresh;
            const reach = Math.min(...fresh.map((row) => row.id));
            const newest = Math.max(...fresh.map((row) => row.id));
            return [...rows.value.filter((row) => row.id > newest), ...fresh, ...rows.value.filter((row) => row.id < reach)];
        });
    }

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

    if (line) {
        context.follow(patterns, heard);
        load();
    }
    return {rows, listing, failure, loaded, more, load, loadLatest, older, act, actionFailure, answer, context};
}
