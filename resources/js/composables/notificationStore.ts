import type { NotificationPage } from '@/generated/types/core';
import { computed, ref, shallowRef } from 'vue';
import type { ComputedRef, Ref } from 'vue';

/**
 * How long a snapshot may show after its last successful authorization; after it the bell hides what it shows
 * until a refresh answers.
 */
export const LEASE_MILLISECONDS = 30_000;

/**
 * The target key of a question notification, as app/Communication/Resolvers/QuestionNotificationTarget.php names it.
 */
export const QUESTION_TARGET = 'chat.question';

/**
 * Why a notification request failed: the server refused it, or its answer never arrived, so only a later read can
 * tell whether it took effect.
 */
export type NotificationFailure = 'refused' | 'lost';

export class NotificationRequestFailed extends Error {
    constructor(public readonly failure: NotificationFailure) {
        super(`The notification request was ${failure}.`);
    }
}

/**
 * The server calls the store makes; each answers the newest page or throws NotificationRequestFailed.
 */
export type NotificationClient = {
    page(cursor: string | null): Promise<NotificationPage>;
    markRead(receiptId: string): Promise<NotificationPage>;
    markQuestionRead(messageId: string): Promise<NotificationPage>;
};

/**
 * What the bell renders: still loading, the first load failed, a snapshot is loaded, a refresh failed with the
 * last snapshot kept, or the lease ran out.
 */
export type NotificationLoadState = 'loading' | 'failed' | 'loaded' | 'refreshFailed' | 'expired';

export type NotificationStore = {
    state: Ref<NotificationLoadState>;
    // The snapshot the bell may show now: none while loading, after a failed first load or past the lease.
    shown: ComputedRef<NotificationPage | null>;
    pending: Ref<ReadonlySet<string>>;
    canChange: ComputedRef<boolean>;
    refresh(): Promise<void>;
    markRead(receiptId: string): Promise<void>;
    markQuestionRead(messageId: string): Promise<void>;
    checkLease(): void;
    purge(): void;
};

/**
 * One tab's notification snapshot for the signed-in actor: a reply older than the held version, or started before a
 * purge, is dropped; a snapshot older than its lease hides; a mark whose answer was lost reads again and retries only
 * while the receipt is still unread, so the count falls once.
 */
export function notificationStore(
    client: NotificationClient,
    now: () => number = Date.now,
): NotificationStore {
    const state = ref<NotificationLoadState>('loading');
    const snapshot = shallowRef<NotificationPage | null>(null);
    const pending = ref<ReadonlySet<string>>(new Set());
    let generation = 0;
    let authorizedAt = 0;

    const shown = computed(() =>
        state.value === 'loaded' || state.value === 'refreshFailed'
            ? snapshot.value
            : null,
    );
    const canChange = computed(() => state.value === 'loaded');

    function take(page: NotificationPage, startedIn: number): void {
        if (startedIn !== generation) {
            return;
        }

        authorizedAt = now();

        if (snapshot.value === null || BigInt(page.version) >= BigInt(snapshot.value.version)) {
            snapshot.value = page;
        }

        state.value = 'loaded';
    }

    function failed(startedIn: number): void {
        if (startedIn !== generation) {
            return;
        }

        state.value = snapshot.value === null ? 'failed' : 'refreshFailed';
    }

    async function refresh(): Promise<void> {
        const startedIn = generation;

        try {
            take(await client.page(null), startedIn);
        } catch {
            failed(startedIn);
        }
    }

    function setPending(id: string, isPending: boolean): void {
        const next = new Set(pending.value);

        if (isPending) {
            next.add(id);
        } else {
            next.delete(id);
        }

        pending.value = next;
    }

    /**
     * Whether the snapshot shows the question's receipt read; a question outside the snapshot may still be unread.
     */
    function isQuestionRead(messageId: string): boolean {
        return snapshot.value?.items.some(
            (item) => item.target?.key === QUESTION_TARGET && item.target.id === messageId && item.readAt !== null,
        ) ?? false;
    }

    function isStillUnread(receiptId: string): boolean {
        return snapshot.value?.items.some((item) => item.id === receiptId && item.readAt === null) ?? false;
    }

    async function mark(id: string, send: () => Promise<NotificationPage>, isUnread: () => boolean): Promise<void> {
        const startedIn = generation;
        setPending(id, true);

        try {
            take(await send(), startedIn);
        } catch (error) {
            if (error instanceof NotificationRequestFailed && error.failure === 'lost') {
                await refresh();

                if (startedIn === generation && isUnread()) {
                    await send().then((page) => take(page, startedIn)).catch(() => failed(startedIn));
                }
            } else {
                failed(startedIn);
            }
        } finally {
            if (startedIn === generation) {
                setPending(id, false);
            }
        }
    }

    function checkLease(): void {
        if (snapshot.value !== null && now() - authorizedAt >= LEASE_MILLISECONDS) {
            state.value = 'expired';
        }
    }

    function purge(): void {
        generation++;
        snapshot.value = null;
        pending.value = new Set();
        authorizedAt = 0;
        state.value = 'loading';
    }

    return {
        state,
        shown,
        pending,
        canChange,
        refresh,
        markRead: (receiptId) => mark(receiptId, () => client.markRead(receiptId), () => isStillUnread(receiptId)),
        markQuestionRead: (messageId) =>
            mark(messageId, () => client.markQuestionRead(messageId), () => !isQuestionRead(messageId)),
        checkLease,
        purge,
    };
}
