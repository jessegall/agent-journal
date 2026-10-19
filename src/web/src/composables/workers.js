import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {pollKey, usePoll} from "./poll.js";

const EVERY = 5000;

function useWorkerPoll(key, query, active = () => true) {
    const rows = ref([]);
    const loaded = ref(false);
    const refresh = usePoll(
        key,
        () => api.list("workers", query()).then((got) => got.rows || []),
        EVERY,
        (got) => {
            rows.value = got;
            loaded.value = true;
        },
        active
    );
    return {rows, loaded, refresh};
}

export const useWorkers = () => useWorkerPoll("workers", () => ({}));

export const useEveryWorker = (open) => useWorkerPoll("workers:every", () => ({limit: 200}), () => open.value);

// The workers that hold any of these tasks.
export function useWorkersHolding(tasks) {
    const ids = computed(() => [...new Set(tasks.value.map((t) => t.worker_id).filter(Boolean))]);
    return useWorkerPoll(`workers:holding:${pollKey()}`, () => ({ids: ids.value}), () => ids.value.length > 0);
}
