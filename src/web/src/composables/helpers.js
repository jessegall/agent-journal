import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {helperAsking, holdingHelpers} from "../domain/helpers.js";
import {store} from "../state/store.js";
import {pollKey, usePoll} from "./poll.js";

const EVERY = 5000;

function useHelperPoll(key, query, active = () => true) {
    const fetched = ref([]);
    const loaded = ref(false);
    const rows = computed(() =>
        fetched.value.map((row) => ({...row, asking: row.completed || row.data?.report ? "" : helperAsking(row, store.summary?.helpers)}))
    );
    const refresh = usePoll(
        key,
        () => api.list("helper", query()).then((got) => got.rows || []),
        EVERY,
        (got) => {
            fetched.value = got;
            loaded.value = true;
        },
        active
    );
    return {rows, loaded, refresh};
}

export const useHelpers = () => useHelperPoll("helpers", () => ({}));

export const useEveryHelper = (open) => useHelperPoll("helpers:every", () => ({completed: true}), () => open.value);

export function useHelpersHolding(todos) {
    const numbers = computed(() => holdingHelpers(todos.value));
    return useHelperPoll(`helpers:holding:${pollKey()}`, () => ({completed: true, only: numbers.value}), () => numbers.value.length > 0);
}
