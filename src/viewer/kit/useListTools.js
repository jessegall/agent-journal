import {computed, inject, ref} from "vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";
import {matchesSearch} from "./searchFields.js";

const NEWEST = "newest";

// what a list shows of its rows: those holding the words searched, open or closed when the list has states, newest first or A to Z
export function useListTools(rows, {title, isOpen = null}) {
    const search = inject(WINDOW_CONTEXT, null)?.search;
    const words = ref("");
    const order = ref(NEWEST);
    const state = ref("all");
    const shown = computed(() => {
        const wanted = words.value.trim().toLowerCase();
        const kept = rows.value.filter((row) => matchesSearch(row, wanted, search?.fields) && (state.value === "all" || !isOpen || isOpen(row) === (state.value === "open")));
        return order.value === NEWEST ? kept : [...kept].sort((one, two) => title(one).localeCompare(title(two)));
    });
    // whether the words or the choice of open or closed hold rows back, which is when an empty list means nothing matches
    const filtering = computed(() => Boolean(words.value.trim()) || (Boolean(isOpen) && state.value !== "all"));
    return {words, order, state, shown, filtering, hasStates: Boolean(isOpen)};
}
