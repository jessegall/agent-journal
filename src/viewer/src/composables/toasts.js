import {onUnmounted, provide, shallowRef} from "vue";
import {PAGE_TOASTS, TOAST} from "../../kit/useToast.js";

export const TOAST_HOLD_MS = 6000;

// the one toast the shell shows: its text and, for an undoable change, the journal command that takes it back.
// `run` sends a line the way the shell sends its own and answers {ok} or {ok: false, error}.
export function makeToasts(run) {
    const current = shallowRef(null);
    let timer = 0;
    const dismiss = () => {
        clearTimeout(timer);
        current.value = null;
    };
    const raise = (text, undo = null) => {
        clearTimeout(timer);
        current.value = {text, undo};
        timer = setTimeout(dismiss, TOAST_HOLD_MS);
    };
    const undo = async () => {
        const line = current.value?.undo?.line;
        if (!line) return;
        dismiss();
        const answer = await run(line);
        if (!answer.ok) raise(answer.error);
    };
    return {current, raise, undo, dismiss};
}

// a page's toasts: its windows raise them with useToast, and the shell's right-click menu says what an item did in the same place
export function usePageToasts(run) {
    const toasts = makeToasts(run);
    provide(TOAST, toasts);
    globalThis[PAGE_TOASTS] = toasts;
    onUnmounted(() => globalThis[PAGE_TOASTS] === toasts && delete globalThis[PAGE_TOASTS]);
    return toasts;
}
