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

export const HELD = "No connection right now: this goes as soon as the phone reaches your computer again.";

export const tryAgain = (error) => `That didn't go through: ${error.message}. Try again.`;
