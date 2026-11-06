import {computed, ref} from "vue";
import {useWindow} from "@journal/window-kit";

// rows read from one line a page at a time: `line(limit)` names the line for that many rows, a page is added behind the rows by reading
// a longer first page, and the rows are read again whenever an event they follow arrives
export function usePagedRead(line, patterns, size) {
    const context = useWindow();
    const rows = ref([]);
    const total = ref(0);
    const failure = ref("");
    const loaded = ref(false);
    let pages = 1;
    let latest = 0;

    async function load() {
        const turn = ++latest;
        const result = await context.read(line(size * pages));
        if (turn !== latest) return;
        failure.value = result.ok ? "" : result.error;
        rows.value = result.ok ? result.value.rows : [];
        total.value = result.ok ? result.value.total : 0;
        loaded.value = true;
    }

    const reset = () => {
        pages = 1;
        return load();
    };
    const more = () => {
        pages += 1;
        return load();
    };

    context.follow(patterns, () => load());
    load();
    return {rows, total, failure, loaded, load, reset, more, hasMore: computed(() => rows.value.length < total.value)};
}
