import { router } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted } from 'vue';

/**
 * Keeps the page on screen up to date. The shell's connection reports changes here; the page mounted now registers how
 * it reloads. A burst of changes becomes one reload, and while a form is being sent the reload waits until it is done,
 * so it never replaces the form's own answer or its errors.
 */
type Reload = () => void;

const coalesceMilliseconds = 250;

let currentReload: Reload | undefined;
let formsSending = 0;
let reloadWaiting = false;
let timer: ReturnType<typeof setTimeout> | undefined;

function reloadNow(): void {
    reloadWaiting = false;

    if (formsSending > 0) {
        reloadWaiting = true;

        return;
    }

    currentReload?.();
}

/**
 * Called by the shell's connection for every change and after a lost connection came back.
 */
export function pageChanged(): void {
    clearTimeout(timer);
    reloadWaiting = true;
    timer = setTimeout(reloadNow, coalesceMilliseconds);
}

/**
 * Called by the shell when the viewer signs out or changes: nothing waits any more.
 */
export function forgetPageChanges(): void {
    clearTimeout(timer);
    reloadWaiting = false;
    formsSending = 0;
}

/**
 * Registers the mounted page's reload of its page prop, and removes it again when the page leaves.
 */
export function useLiveReload(): void {
    const reload: Reload = () =>
        router.reload({ only: ['page'], preserveUrl: true });

    onMounted(() => (currentReload = reload));
    onBeforeUnmount(() => {
        if (currentReload === reload) {
            currentReload = undefined;
        }
    });
}

/**
 * The start and finish hooks a form adds to its submit, so a change that arrives while it is sent is read after it.
 */
export function formSendingHooks(): {
    onStart: () => void;
    onFinish: () => void;
} {
    return {
        onStart: () => {
            formsSending++;
        },
        onFinish: () => {
            formsSending = Math.max(0, formsSending - 1);

            if (formsSending === 0 && reloadWaiting) {
                pageChanged();
            }
        },
    };
}
