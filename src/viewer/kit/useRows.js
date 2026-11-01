import {ref} from "vue";
import {useWindow} from "./windowContextKey.js";

// the rows a window lists from one read line (in a share, the one row it is shared for, read by its model's show line), read again whenever an event it follows arrives, with the reason a read
// failed in place of the rows, and whether the first read has answered
export function useRows(line, patterns, {incremental = false} = {}) {
    const context = useWindow();
    const rows = ref([]);
    const failure = ref("");
    const loaded = ref(false);
    const actionFailure = ref("");
    const answer = ref(null);

    // a created row is asked for alone, after the newest one held; any other change reads the page again
    async function heard(event) {
        const created = incremental && rows.value.length && String(event?.event ?? "").endsWith(".create");
        if (!created) return load();
        const newest = Math.max(...rows.value.map((row) => row.id));
        const result = await context.read(`${line} --after-id ${newest}`);
        if (!result.ok) return load();
        const held = new Set(rows.value.map((row) => row.id));
        rows.value = [...result.value.rows.filter((row) => !held.has(row.id)), ...rows.value];
    }

    // the page of rows older than the oldest held, added behind them; false when there are none
    async function older() {
        if (!rows.value.length) return false;
        const oldest = Math.min(...rows.value.map((row) => row.id));
        const result = await context.read(`${line} --before-id ${oldest}`);
        if (!result.ok || !result.value.rows.length) return false;
        const held = new Set(rows.value.map((row) => row.id));
        rows.value = [...rows.value, ...result.value.rows.filter((row) => !held.has(row.id))];
        return true;
    }

    async function load() {
        const result = await context.read(context.shared ? `${context.shared.model} show ${context.shared.id}` : line);
        rows.value = result.ok ? (context.shared ? [result.value] : result.value.rows) : [];
        failure.value = result.ok ? "" : result.error;
        loaded.value = true;
    }

    // runs a command the window declares, keeps what it answered or why it failed, and reads the rows again
    async function act(words) {
        const result = await context.run(words);
        actionFailure.value = result.ok ? "" : result.error;
        answer.value = result.ok ? result.value : null;
        await load();
        return result;
    }

    context.follow(patterns, heard);
    load();
    return {rows, failure, loaded, load, older, act, actionFailure, answer, context};
}
