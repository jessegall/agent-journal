import {computed, ref, watch} from "vue";

// The row a window shows, kept while the store's list rebuilds and drops it for a moment, so the window never closes and opens again between two answers.
export function useKept(live, key) {
    const held = ref(null);
    watch(
        live,
        (row) => {
            if (row) held.value = {key: key(), row};
        },
        {immediate: true, flush: "sync"}
    );
    return computed(() => live.value || (held.value && held.value.key === key() ? held.value.row : null));
}
