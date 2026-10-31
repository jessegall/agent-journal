import {ref} from "vue";
import {usePoll} from "./poll.js";

// The agents of one kind the journal sent here, read by this poller while the list that shows them is open.
export function useEveryHelper(poller, open) {
    const rows = ref([]);
    const loaded = ref(false);
    const take = (got) => {
        rows.value = got;
        loaded.value = true;
    };
    return {rows, loaded, refresh: usePoll(poller, {take, active: () => open.value})};
}
