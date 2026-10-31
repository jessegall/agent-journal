import {ref} from "vue";
import {useWindow} from "./windowContextKey.js";

// the rows a window lists from one read line, read again whenever an event it follows arrives, with the reason a read
// failed in place of the rows
export function useRows(line, patterns) {
    const context = useWindow();
    const rows = ref([]);
    const failure = ref("");

    async function load() {
        const result = await context.read(line);
        rows.value = result.ok ? result.value.rows : [];
        failure.value = result.ok ? "" : result.error;
    }

    context.follow(patterns, load);
    load();
    return {rows, failure, load, context};
}
