import { router, usePage } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted } from 'vue';

/**
 * Keeps the page on screen up to date. The shell's connection reports changes here; the page mounted now registers how
 * it reloads. A burst of changes becomes one reload, and while a form is being sent the reload waits until it is done,
 * so it never replaces the form's own answer or its errors.
 */
type Reload = () => void;

const coalesceMilliseconds = 250;

/**
 * The reloads of the page on screen: the mounted page's reload, the props shown now, the forms being sent, and
 * whether a reload waits for them.
 */
class PageReloads {
    current: Reload | undefined;

    /**
     * The window and section props on screen now, each counted by the hosts that show it; only these are read again
     * on a change, so a hidden or closed window is never asked for.
     */
    readonly shownProps = new Map<string, number>();

    private formsSending = 0;
    private isWaiting = false;
    private timer: ReturnType<typeof setTimeout> | undefined;

    /** Reloads after a short pause, so a burst of changes becomes one reload. */
    schedule(): void {
        clearTimeout(this.timer);
        this.isWaiting = true;
        this.timer = setTimeout(() => this.reloadNow(), coalesceMilliseconds);
    }

    forget(): void {
        clearTimeout(this.timer);
        this.isWaiting = false;
        this.formsSending = 0;
    }

    formStarted(): void {
        this.formsSending++;
    }

    formFinished(): void {
        this.formsSending = Math.max(0, this.formsSending - 1);

        if (this.formsSending === 0 && this.isWaiting) {
            this.schedule();
        }
    }

    private reloadNow(): void {
        this.isWaiting = this.formsSending > 0;

        if (!this.isWaiting) {
            this.current?.();
        }
    }
}

const reloads = new PageReloads();

/**
 * Called by the shell's connection for every change and after a lost connection came back.
 */
export function pageChanged(): void {
    reloads.schedule();
}

/**
 * Called by the shell when the user signs out or changes: nothing waits any more.
 */
export function forgetPageChanges(): void {
    reloads.forget();
}

/**
 * Called by a window or section host while its prop is on screen; the function it answers takes the prop off again.
 */
export function showProp(name: string): () => void {
    const shownProps = reloads.shownProps;
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
    const reload: Reload = () => {
        const only = ['page', ...reloads.shownProps.keys(), 'navigation', 'navigationCounts'];

        if (page.props.inspector !== undefined && page.props.inspector !== null) {
            only.push('inspector');
        }

        router.reload({ only, preserveUrl: true });
    };

    onMounted(() => (reloads.current = reload));
    onBeforeUnmount(() => {
        if (reloads.current === reload) {
            reloads.current = undefined;
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
        onStart: () => reloads.formStarted(),
        onFinish: () => reloads.formFinished(),
    };
}
