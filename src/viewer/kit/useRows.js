import {ref} from "vue";
import {useWindow} from "./windowContextKey.js";

// the rows a window lists from one read line (in a share, the one row it is shared for, read by its model's show line), read again whenever an event it follows arrives, with the reason a read
// failed in place of the rows, and whether the first read has answered
export function useRows(line, patterns) {
    const context = useWindow();
    const rows = ref([]);
    const failure = ref("");
    const loaded = ref(false);

    async function load() {
        const result = await context.read(context.shared ? `${context.shared.model} show ${context.shared.id}` : line);
        rows.value = result.ok ? (context.shared ? [result.value] : result.value.rows) : [];
        failure.value = result.ok ? "" : result.error;
        loaded.value = true;
    }

    context.follow(patterns, load);
    load();
    return {rows, failure, loaded, load, context};
}
