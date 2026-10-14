import {ref} from "vue";

export const SHOWN_FOR = 6000;

export const toasted = ref(null);
let timer = 0;

export function toast(text, undo = null) {
    toasted.value = {id: performance.now(), text, undo};
    resumeToast();
}

export function pauseToast() {
    clearTimeout(timer);
}

export function resumeToast() {
    clearTimeout(timer);
    if (toasted.value) timer = setTimeout(dismissToast, SHOWN_FOR);
}

export function dismissToast() {
    clearTimeout(timer);
    toasted.value = null;
}

export function undoToast() {
    const undo = toasted.value?.undo;
    dismissToast();
    undo?.();
}

export async function copyShown(text, what) {
    try {
        await navigator.clipboard.writeText(text);
        toast(`The ${what} is copied`);
    } catch {
        toast(`Could not copy the ${what}`);
    }
}
