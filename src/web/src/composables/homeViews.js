import {computed} from "vue";
import {store} from "../state/store.js";

// What waits on the user, as the figure counts it: open questions here.
export function useHomeViews() {
    const views = computed(() => ({question: {count: store.counts.question}, waiting: {count: store.counts.waiting}, suggestion: {count: store.counts.suggestion}}));
    return {views};
}
