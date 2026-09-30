import {nextTick, ref} from "vue";

export const spoken = ref("");

export function announce(words) {
    spoken.value = "";
    nextTick(() => (spoken.value = words));
}

export function tell(line, words) {
    line.value = words;
    if (words) announce(words);
}
