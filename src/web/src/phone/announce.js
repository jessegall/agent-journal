import {nextTick, ref} from "vue";

export const spoken = ref("");

export function announce(words) {
    spoken.value = "";
    nextTick(() => (spoken.value = words));
}
