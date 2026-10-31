import {ref} from "vue";
import {usePoll} from "./poll.js";

// The workers' test turns running and waiting, read while the workers panel shows them.
export function useTestTurns(active) {
    const turns = ref([]);
    const loaded = ref(false);
    const take = (got) => {
        turns.value = got;
        loaded.value = true;
    };
    usePoll("tests.turns", {take, active: () => active.value});
    return {turns, loaded};
}
