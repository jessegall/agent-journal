import type { PendingVisit } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted, reactive, readonly, ref } from 'vue';
import { LOADER_HEADER } from '@/framework/loaders';
import { login } from '@/routes';
import { traceLive } from './liveTrace';
import { purge, trackProtectedRead } from './protectedView';

/**
 * Keeps the page on screen up to date: every reload the Inertia live client starts runs as this tab's own async reload,
 * never cancelling a form or a navigation. Changes during a read make one trailing read, a form being sent makes it
 * wait, and a failed read retries after 1, 2 and 4 seconds.
 */
export type PageReadStatus = 'idle' | 'reading' | 'retrying' | 'failed';

/**
 * Why the page is to be read again: a live event, a catch-up after the channel was first signed in to, the window
 * regaining focus, or a caller that knows its change.
 */
export type DirtyReason = 'signal' | 'catch-up' | 'focus' | 'write';

/**
 * How one read ended: its answer was applied, it failed, or a navigation cancelled it.
 */
export type PageReadEnd = 'applied' | 'failed' | 'cancelled';

/**
 * Reads the named props again and calls ended exactly once when that read is over.
 */
export type PageRead = (only: string[], ended: (end: PageReadEnd) => void) => void;

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
     * The props marked to be read again and not yet read.
     */
    private readonly wanted = new Set<string>();

    private dirtyGeneration = 0;

    private isReading = false;

    private formsSending = 0;

    private failures = 0;

    private retryTimer: ReturnType<typeof setTimeout> | undefined;

    constructor(private readonly read: PageRead) {}

    /**
     * Marks the props dirty and answers the generation marked: a read covers it once appliedGeneration reaches it.
     */
    markDirty(reason: DirtyReason, props: string[]): number {
        const marked = ++this.dirtyGeneration;
        props.forEach((prop) => this.wanted.add(prop));

        if (reason === 'focus' && this.status.value === 'failed') {
            this.resume();

            return marked;
        }

        this.readNext();

        return marked;
    }

    /**
     * Reads the props again now, after a failure or when the user asks for it.
     */
    retry(props: string[]): void {
        props.forEach((prop) => this.wanted.add(prop));
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
     * A navigation brought a new page: dirty work a cancelled read left is read on it.
     */
    pageArrived(): void {
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
        this.wanted.clear();
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
        if (!this.isDirty() || !this.mayStart()) {
            return;
        }

        const covered = this.dirtyGeneration;
        const only = [...this.wanted];
        let hasEnded = false;
        this.wanted.clear();
        this.isReading = true;
        this.status.value = this.failures === 0 ? 'reading' : 'retrying';

        this.read(only, (end) => {
            if (hasEnded) {
                return;
            }

            hasEnded = true;
            this.isReading = false;
            this.settle(end, covered, only);

            // A navigation cancelled it: the page it leads to reads the dirty work when it arrives.
            if (end !== 'cancelled') {
                this.readNext();
            }
        });
    }

    private settle(end: PageReadEnd, covered: number, only: string[]): void {
        if (end === 'applied') {
            this.failures = 0;
            this.appliedGeneration.value = Math.max(this.appliedGeneration.value, covered);
            this.status.value = 'idle';

            return;
        }

        only.forEach((prop) => this.wanted.add(prop));

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

/**
 * The props the last failed page read included: each keeps what it showed, read-only, until a read applies again.
 * A prop the page did not read in that batch stays fresh.
 */
const staleProps = reactive(new Set<string>());

/**
 * Whether this tab is sending its own page read now, so its before event is let through.
 */
let isSendingOwnRead = false;

/**
 * The live props the page on screen holds: those the server marked live and the page asked for.
 */
function requestedLiveProps(): string[] {
    const page = usePage();

    return Object.keys(page.liveProps ?? {}).filter((prop) => page.props[prop] !== undefined);
}

/**
 * One page read: an async partial reload of the props still on the page, which never cancels a form or a navigation.
 */
function readPage(wanted: string[], ended: (end: PageReadEnd) => void): void {
    const requested = new Set(requestedLiveProps());
    const only = wanted.filter((prop) => requested.has(prop));

    // Nothing on the page is live: the read is over at once, after the caller has taken the generation it marked.
    if (only.length === 0) {
        queueMicrotask(() => ended('applied'));

        return;
    }

    let end: PageReadEnd = 'cancelled';
    let untrack: (() => void) | undefined;
    const finish = (how: PageReadEnd) => {
        untrack?.();
        ended(how);
    };
    const failed = () => {
        end = 'failed';
        only.forEach((name) => staleProps.add(name));
        traceLive('read failed');
    };

    isSendingOwnRead = true;

    try {
        router.reload({
            only,
            async: true,
            preserveUrl: true,
            preserveErrors: true,
            onCancelToken: (token) => (untrack = trackProtectedRead(token)),
            onStart: () => traceLive('read started'),
            onSuccess: () => {
                end = 'applied';
                staleProps.clear();
                traceLive('read applied');
            },
            onHttpException: (response) => {
                failed();
                answerRefusedRead(response.status);

                return false;
            },
            onNetworkError: () => {
                failed();

                return false;
            },
            onFinish: () => finish(end),
            onCancel: () => finish('cancelled'),
        });
    } finally {
        isSendingOwnRead = false;
    }
}

const reads = new PageReadScheduler(readPage);

/**
 * A reload the Inertia live client started: a GET partial reload that names only live props of the page, and is no
 * loader call and no first load of deferred props.
 */
function isLiveVisit(visit: PendingVisit): boolean {
    const live = new Set(Object.keys(usePage().liveProps ?? {}));

    return visit.method === 'get'
        && visit.only.length > 0
        && !(LOADER_HEADER in visit.headers)
        && !visit.deferredProps
        && visit.only.every((prop) => live.has(prop));
}

/**
 * Whether the prop was part of a page read that failed and has not been read since, whatever it last held.
 */
export function isPropStale(name: string): boolean {
    return staleProps.has(name);
}

/**
 * Whether any prop on screen waits for a read that failed, so the page shows its one notice.
 */
export function hasStaleProps(): boolean {
    return staleProps.size > 0;
}

/**
 * Where the page's reads stand, for a host that shows Retry, and the dirty generation the last applied read covered.
 */
export const pageReadStatus = readonly(reads.status);

export const appliedReadGeneration = readonly(reads.appliedGeneration);

/**
 * Marks the page's live props to be read again, for a caller that knows why, and answers the generation marked.
 */
export function markDirty(reason: DirtyReason): number {
    return reads.markDirty(reason, requestedLiveProps());
}

/**
 * Reads the stale props again now, after a failed read.
 */
export function retryPageRead(): void {
    reads.retry([...staleProps, ...requestedLiveProps()]);
}

/**
 * Called by the shell when the user signs out or changes: nothing waits any more.
 */
export function forgetPageChanges(): void {
    reads.forget();
    staleProps.clear();
}

/**
 * Takes over every reload the live client starts while the shell is mounted: the live visit is cancelled and its
 * props are read as this tab's own read. A new page reads what a cancelled read left, and the window regaining focus
 * marks the live props dirty.
 */
export function useLiveVisits(): void {
    const markFocused = () => markDirty('focus');
    let stopBefore: (() => void) | undefined;
    let stopNavigate: (() => void) | undefined;

    onMounted(() => {
        stopBefore = router.on('before', (event) => {
            const visit = event.detail.visit;

            if (isSendingOwnRead || !isLiveVisit(visit)) {
                return;
            }

            traceLive('signal received');
            reads.markDirty('signal', visit.only);

            return false;
        });
        stopNavigate = router.on('navigate', () => reads.pageArrived());
        window.addEventListener('focus', markFocused);
    });
    onBeforeUnmount(() => {
        stopBefore?.();
        stopNavigate?.();
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
