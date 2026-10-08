import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {helperAsking} from "../domain/helpers.js";
import {store} from "../state/store.js";
import {usePoll} from "./poll.js";

const EVERY = 5000;

export function useHelpers() {
    const fetched = ref([]);
    const loaded = ref(false);
    const rows = computed(() =>
        fetched.value.map((row) => ({...row, asking: row.completed || row.data?.report ? "" : helperAsking(row, store.summary?.helpers)}))
    );
    const refresh = usePoll(
        "helpers",
        () => api.list("helper", {completed: true}).then((got) => got.rows || []),
        EVERY,
        (got) => {
            fetched.value = got;
            loaded.value = true;
        },
    );
    return {rows, loaded, refresh};
}
