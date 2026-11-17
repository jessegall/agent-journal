import { router, usePage } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted } from 'vue';

/**
 * Keeps the page on screen up to date. The shell's connection reports changes here; the page mounted now registers how
 * it reloads. A burst of changes becomes one reload, and while a form is being sent the reload waits until it is done,
 * so it never replaces the form's own answer or its errors.
 */
type Reload = () => void;

const coalesceMilliseconds = 250;

let currentReload: Reload | undefined;

/**
 * The window and section props on screen now, each counted by the hosts that show it; only these are read again on a
 * change, so a hidden or closed window is never asked for.
 */
const shownProps = new Map<string, number>();
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
 * Called by a window or section host while its prop is on screen; the function it answers takes the prop off again.
 */
export function showProp(name: string): () => void {
    shownProps.set(name, (shownProps.get(name) ?? 0) + 1);

    return () => {
        const count = (shownProps.get(name) ?? 1) - 1;

        if (count > 0) {
            shownProps.set(name, count);
        } else {
            shownProps.delete(name);
        }
    };
}

/**
 * Registers the mounted page's reload, and removes it again when the page leaves: its own page prop, the windows and
 * sections on screen, the navigation with its counts, and the inspector when a record is open in it.
 */
export function useLiveReload(): void {
    const page = usePage();
    const reload: Reload = () =>
        router.reload({
            only: [
                'page',
                ...shownProps.keys(),
                'navigation',
                'navigationCounts',
                ...(page.props.inspector === undefined || page.props.inspector === null ? [] : ['inspector']),
            ],
            preserveUrl: true,
        });

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
