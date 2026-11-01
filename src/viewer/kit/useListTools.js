import {computed, ref} from "vue";

const NEWEST = "newest";

// what a list shows of its rows: those holding the words searched, open or closed when the list has states, newest first or A to Z
export function useListTools(rows, {title, isOpen = null}) {
    const words = ref("");
    const order = ref(NEWEST);
    const state = ref("all");
    const shown = computed(() => {
        const wanted = words.value.trim().toLowerCase();
        const kept = rows.value.filter((row) => (!wanted || JSON.stringify(row).toLowerCase().includes(wanted)) && (state.value === "all" || !isOpen || isOpen(row) === (state.value === "open")));
        return order.value === NEWEST ? kept : [...kept].sort((one, two) => title(one).localeCompare(title(two)));
    });
    return {words, order, state, shown, hasStates: Boolean(isOpen)};
}
