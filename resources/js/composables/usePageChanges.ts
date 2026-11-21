import { router, usePage } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted, readonly, ref } from 'vue';
import { login } from '@/routes';
import { traceLive } from './liveTrace';
import { purge, trackProtectedRead } from './protectedView';

/**
 * Keeps the page on screen up to date. The shell's connection marks the page dirty here, and the page mounted now
 * registers how it reads itself again. The first change is read at once; changes that come during a read make one
 * trailing read after it; while a form is being sent the read waits until it is done, so it never replaces the form's
 * own answer or its errors. A failed read is tried again after 1, 2 and 4 seconds, then waits for Retry or focus.
 */
export type PageReadStatus = 'idle' | 'reading' | 'retrying' | 'failed';

/**
 * Why the page is to be read again: a signal from the connection, a catch-up after the channel was signed in to,
 * the window regaining focus, or a caller that knows its change.
 */
export type DirtyReason = 'signal' | 'catch-up' | 'focus' | 'write';

/**
 * How one read ended: its answer was applied, it failed, or a navigation cancelled it.
 */
export type PageReadEnd = 'applied' | 'failed' | 'cancelled';

/**
 * Reads the page again and calls ended exactly once when that read is over.
 */
export type PageRead = (ended: (end: PageReadEnd) => void) => void;

const RETRY_DELAYS_MS = [1000, 2000, 4000];

/**
 * The page reads of one tab: one at a time, each covering every change marked before it started.
 */
export class PageReadScheduler {
    readonly status = ref<PageReadStatus>('idle');

    /**
     * The dirty generation the last applied read covered.
     */
    readonly appliedGeneration = ref(0);

    /**
     * The window and section props on screen now, each counted by the hosts that show it; only these are read again
     * on a change, so a hidden or closed window is never asked for.
     */
    readonly shownProps = new Map<string, number>();

    private read: PageRead | undefined;

    private dirtyGeneration = 0;

    private isReading = false;

    private formsSending = 0;

    private failures = 0;

    private retryTimer: ReturnType<typeof setTimeout> | undefined;

    /**
     * Makes this the page's read; dirty work marked before it was mounted is read now. The answer takes it off again.
     */
    host(read: PageRead): () => void {
        this.read = read;
        this.readNext();

        return () => {
            if (this.read === read) {
                this.read = undefined;
            }
        };
    }

    /**
     * Marks the page dirty and answers the generation marked: a read covers it once appliedGeneration reaches it.
     */
    markDirty(reason: DirtyReason): number {
        const marked = ++this.dirtyGeneration;

        if (reason === 'focus' && this.status.value === 'failed') {
            this.resume();

            return marked;
        }

        this.readNext();

        return marked;
    }

    /**
     * Reads again now, after a failure or when the user asks for it.
     */
    retry(): void {
        this.dirtyGeneration = Math.max(this.dirtyGeneration, this.appliedGeneration.value + 1);
        this.resume();
    }

    formStarted(): void {
        this.formsSending++;
    }

    formFinished(): void {
        this.formsSending = Math.max(0, this.formsSending - 1);
        this.readNext();
    }

    /**
     * Nothing waits any more: the user signed out or changed.
     */
    forget(): void {
        clearTimeout(this.retryTimer);
        this.retryTimer = undefined;
        this.formsSending = 0;
        this.failures = 0;
        this.dirtyGeneration = this.appliedGeneration.value;
        this.status.value = 'idle';
    }

    private resume(): void {
        clearTimeout(this.retryTimer);
        this.retryTimer = undefined;
        this.failures = 0;
        this.status.value = 'idle';
        this.readNext();
    }

    private readNext(): void {
        const read = this.read;

        if (read === undefined || !this.isDirty() || !this.mayStart()) {
            return;
        }

        const covered = this.dirtyGeneration;
        let hasEnded = false;
        this.isReading = true;
        this.status.value = this.failures === 0 ? 'reading' : 'retrying';

        read((end) => {
            if (hasEnded) {
                return;
            }

            hasEnded = true;
            this.isReading = false;
            this.settle(end, covered);

            // A navigation cancelled it: the page it leads to reads the dirty work when it mounts.
            if (end !== 'cancelled') {
                this.readNext();
            }
        });
    }

    private settle(end: PageReadEnd, covered: number): void {
        if (end === 'applied') {
            this.failures = 0;
            this.appliedGeneration.value = Math.max(this.appliedGeneration.value, covered);
            this.status.value = 'idle';

            return;
        }

        if (end === 'cancelled') {
            this.status.value = 'idle';

            return;
        }

        this.failures++;

        if (this.failures > RETRY_DELAYS_MS.length) {
            this.status.value = 'failed';

            return;
        }

        this.status.value = 'retrying';
        this.retryTimer = setTimeout(() => {
            this.retryTimer = undefined;
            this.readNext();
        }, RETRY_DELAYS_MS[this.failures - 1]);
    }

    private isDirty(): boolean {
        return this.dirtyGeneration > this.appliedGeneration.value;
    }

    private mayStart(): boolean {
        return !this.isReading
            && this.formsSending === 0
            && this.retryTimer === undefined
            && this.status.value !== 'failed';
    }
}

const reads = new PageReadScheduler();

/**
 * Where the page's reads stand, for a host that shows Retry, and the dirty generation the last applied read covered.
 */
export const pageReadStatus = readonly(reads.status);

export const appliedReadGeneration = readonly(reads.appliedGeneration);

/**
 * Called by the shell's connection for every change and after a lost connection came back.
 */
export function pageChanged(): void {
    reads.markDirty('signal');
}

/**
 * Marks the page to be read again, for a caller that knows why, and answers the generation marked.
 */
export function markDirty(reason: DirtyReason): number {
    return reads.markDirty(reason);
}

/**
 * Reads the page again now, after a failed read.
 */
export function retryPageRead(): void {
    reads.retry();
}

/**
 * Called by the shell when the user signs out or changes: nothing waits any more.
 */
export function forgetPageChanges(): void {
    reads.forget();
}

/**
 * Called by a window or section host while its prop is on screen; the function it answers takes the prop off again.
 */
export function showProp(name: string): () => void {
    const shownProps = reads.shownProps;
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
 * Registers the mounted page's read, and removes it again when the page leaves: its own page prop, the windows and
 * sections on screen, the navigation with its counts, and the inspector when a record is open in it. The window
 * regaining focus marks the page dirty.
 */
export function useLiveReload(): void {
    const page = usePage();
    const read: PageRead = (ended) => {
        const only = ['page', ...reads.shownProps.keys(), 'navigation', 'navigationCounts'];

        if (page.props.inspector !== undefined && page.props.inspector !== null) {
            only.push('inspector');
        }

        let end: PageReadEnd = 'cancelled';
        let untrack: (() => void) | undefined;
        const finish = (how: PageReadEnd) => {
            untrack?.();
            ended(how);
        };
        router.reload({
            only,
            preserveUrl: true,
            onCancelToken: (token) => (untrack = trackProtectedRead(token)),
            onStart: () => traceLive('read started'),
            onSuccess: () => {
                end = 'applied';
                traceLive('read applied');
            },
            onHttpException: (response) => {
                end = 'failed';
                traceLive('read failed');
                answerRefusedRead(response.status);

                return false;
            },
            onNetworkError: () => {
                end = 'failed';
                traceLive('read failed');

                return false;
            },
            onFinish: () => finish(end),
            onCancel: () => finish('cancelled'),
        });
    };
    const markFocused = () => reads.markDirty('focus');
    let leave: (() => void) | undefined;

    onMounted(() => {
        leave = reads.host(read);
        window.addEventListener('focus', markFocused);
    });
    onBeforeUnmount(() => {
        leave?.();
        window.removeEventListener('focus', markFocused);
    });
}

/**
 * A read the server refused: a denial hides and forgets what protected views show, and an expired sign-in goes back to
 * the sign-in page. Any other failure is retried.
 */
function answerRefusedRead(status: number): void {
    if (status === 403) {
        purge();

        return;
    }

    if (status === 401 || status === 419) {
        router.visit(login());
    }
}

/**
 * The start and finish hooks a form adds to its submit, so a change that arrives while it is sent is read after it.
 * A JSON write never uses them and holds no read back.
 */
export function formSendingHooks(): {
    onStart: () => void;
    onFinish: () => void;
} {
    return {
        onStart: () => reads.formStarted(),
        onFinish: () => reads.formFinished(),
    };
}
