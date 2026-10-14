import {nextTick, ref} from "vue";

export const UNDO_MS = 6000;
export const undoing = ref(null);
export const spoken = ref("");

export function speak(words) {
    spoken.value = "";
    if (words) nextTick(() => (spoken.value = words));
}

export function offerUndo(n, reopen) {
    undoing.value = {text: `You said no to suggestion ${n}`, label: "Undo", action: () => reopen(n)};
}
