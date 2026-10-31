import {ref, watch} from "vue";

const GROUP_FROM = 3;

// Whether the docked runs share one compact row: from three at once, and on until one run is left
export function useRunGroup(runs) {
    const grouped = ref(false);
    watch(
        () => runs.value.length,
        (count) => {
            if (count >= GROUP_FROM) grouped.value = true;
            else if (count <= 1) grouped.value = false;
        },
        {immediate: true}
    );
    return grouped;
}
