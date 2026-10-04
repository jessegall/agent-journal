import {ref} from "vue";
import {api} from "../api/client.js";
import {usePoll} from "../poll.js";

const EVERY = 5000;

export function useHelpers() {
    const rows = ref([]);
    const refresh = usePoll(
        "helpers",
        () => api.list("helper", {completed: true}).then((got) => got.rows || []),
        EVERY,
        (got) => (rows.value = got),
    );
    return {rows, refresh};
}
