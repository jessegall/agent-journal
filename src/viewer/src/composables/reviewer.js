import {ref} from "vue";
import {usePoll} from "./poll.js";

// The steps of the reviewers the journal sent here, read while the reviewer pane is open.
export function useReviewSteps() {
    const steps = ref([]);
    const loaded = ref(false);
    const take = (got) => {
        steps.value = got;
        loaded.value = true;
    };
    usePoll("reviewer.steps", {take});
    return {steps, loaded};
}
