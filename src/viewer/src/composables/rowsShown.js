import {ref} from "vue";
import {usePoll} from "./poll.js";

// Rows of one table read by id, which carries the relations, such as a collection's members, that its list leaves out.
export function useRowsShown(table, ids) {
    const rows = ref([]);
    const take = (got) => (rows.value = got);
    return {rows, refresh: usePoll("rows.shown", {params: () => ({table: table(), ids: ids.value}), take, active: () => Boolean(table()) && ids.value.length > 0})};
}
