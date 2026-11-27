import type { NotificationItem } from '@/generated/types/core';
import type { NotificationChangePage, NotificationPage } from '@/types/generated';
import { computed, ref, shallowRef } from 'vue';
import type { ComputedRef, Ref } from 'vue';

/**
 * How long a snapshot may show after its last successful authorization; after it the bell hides what it shows
 * until a refresh answers.
 */
export const LEASE_MILLISECONDS = 30_000;

/**
 * The pending key of a Mark all under way.
 */
export const MARK_ALL = 'all';

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
    markTargetRead(targetKey: string, targetId: string): Promise<NotificationPage>;
    changes(cursor: string): Promise<NotificationChangePage>;
    markAll(through: string): Promise<NotificationPage>;
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
    // The rows the list shows: the first page and every older page loaded, newest first.
    items: ComputedRef<NotificationItem[]>;
    // Whether an older page waits to be loaded, whether its last load failed, and whether newer rows wait above.
    hasOlder: ComputedRef<boolean>;
    olderFailed: Ref<boolean>;
    hasNewItems: Ref<boolean>;
    loadOlder(): Promise<void>;
    revealNew(): void;
    pending: Ref<ReadonlySet<string>>;
    canChange: ComputedRef<boolean>;
    refresh(): Promise<void>;
    markRead(receiptId: string): Promise<void>;
    markTargetRead(targetKey: string, targetId: string): Promise<void>;
    // Marks every unread receipt up to the shown list's watermark read; later arrivals stay unread.
    markAll(): Promise<void>;
    // Reads the changes since the held cursor and answers the new, still visible, unread arrivals among them.
    catchUp(): Promise<NotificationItem[]>;
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
    let changesCursor: string | null = null;
    const listed = shallowRef<NotificationItem[]>([]);
    const olderCursor = ref<string | null>(null);
    const olderFailed = ref(false);
    const hasNewItems = ref(false);
    let olderLoaded = false;

    const shown = computed(() =>
        state.value === 'loaded' || state.value === 'refreshFailed'
            ? snapshot.value
            : null,
    );
    const canChange = computed(() => state.value === 'loaded' && !olderFailed.value);
    const items = computed(() => (shown.value === null ? [] : listed.value));
    const hasOlder = computed(() => olderCursor.value !== null);

    /**
     * Shows a new first page, unless older pages are open: then the shown rows only take their new read states and
     * the new rows wait above them until revealed, so nothing moves under the reader.
     */
    function list(page: NotificationPage): void {
        if (!olderLoaded) {
            listed.value = page.items;
            olderCursor.value = page.nextCursor;

            return;
        }

        const current = new Map(page.items.map((item) => [item.id, item]));
        const known = new Set(listed.value.map((row) => row.id));
        hasNewItems.value = hasNewItems.value || page.items.some((item) => !known.has(item.id));
        listed.value = listed.value.map((row) => current.get(row.id) ?? row);
    }

    function take(page: NotificationPage, startedIn: number): void {
        if (startedIn !== generation) {
            return;
        }

        authorizedAt = now();

        if (snapshot.value === null || BigInt(page.version) >= BigInt(snapshot.value.version)) {
            snapshot.value = page;
            changesCursor = page.changesCursor;
            list(page);
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
     * Whether the snapshot shows the target's receipt read; a target outside the snapshot may still be unread.
     */
    function isTargetRead(targetKey: string, targetId: string): boolean {
        return snapshot.value?.items.some(
            (item) => item.target?.key === targetKey && item.target.id === targetId && item.readAt !== null,
        ) ?? false;
    }

    /**
     * An older row the first page does not hold takes its read state from the server's next read; until then a mark
     * the server took shows it read.
     */
    function showReadOlderRow(receiptId: string): void {
        if (snapshot.value === null || snapshot.value.items.some((item) => item.id === receiptId)) {
            return;
        }

        listed.value = listed.value.map((row) =>
            row.id === receiptId && row.readAt === null ? { ...row, readAt: new Date(now()).toISOString() } : row,
        );
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
            // A refused mark changed nothing: the reader holds no such receipt, so the snapshot stands as it is.
            if (error instanceof NotificationRequestFailed && error.failure === 'lost') {
                await refresh();

                if (startedIn === generation && isUnread()) {
                    await send().then((page) => take(page, startedIn)).catch(() => undefined);
                }
            }
        } finally {
            if (startedIn === generation) {
                setPending(id, false);
            }
        }
    }

    /**
     * Follows the change log page by page through the scan's pinned version, then takes the newest snapshot for the
     * count and the rows; a reset takes the snapshot alone, so a reconnect never turns into a backlog.
     */
    async function catchUp(): Promise<NotificationItem[]> {
        const startedIn = generation;

        if (changesCursor === null) {
            await refresh();

            return [];
        }

        const created = new Map<string, NotificationItem>();
        const removed = new Set<string>();
        let cursor: string | null = changesCursor;

        try {
            while (cursor !== null) {
                const page: NotificationChangePage = await client.changes(cursor);

                if (startedIn !== generation) {
                    return [];
                }

                if (page.isReset) {
                    await refresh();

                    return [];
                }

                for (const change of page.changes) {
                    if (change.type === 'remove') {
                        removed.add(change.receiptId);
                        created.delete(change.receiptId);
                    } else if (change.type === 'create' && change.item !== undefined) {
                        created.set(change.receiptId, change.item);
                    }
                }

                changesCursor = page.cursor;
                cursor = page.nextCursor;
            }
        } catch (error) {
            // A cursor the server no longer reads starts again from the first page, as a reset does.
            if (error instanceof NotificationRequestFailed && error.failure === 'refused') {
                await refresh();

                return [];
            }

            failed(startedIn);

            return [];
        }

        await refresh();
        const visible = new Map((snapshot.value?.items ?? []).map((item) => [item.id, item]));

        return [...created.keys()]
            .filter((id) => !removed.has(id))
            .map((id) => visible.get(id))
            .filter((item): item is NotificationItem => item !== undefined && item.readAt === null);
    }

    /**
     * Appends the next older page; a failed load keeps the rows and the cursor, so Retry asks for the same page, and
     * holds changes and paging until it succeeds.
     */
    async function loadOlder(): Promise<void> {
        const cursor = olderCursor.value;
        const startedIn = generation;

        if (cursor === null) {
            return;
        }

        try {
            const page = await client.page(cursor);

            if (startedIn !== generation) {
                return;
            }

            const known = new Set(listed.value.map((item) => item.id));
            listed.value = [...listed.value, ...page.items.filter((item) => !known.has(item.id))];
            olderCursor.value = page.nextCursor;
            olderLoaded = true;
            olderFailed.value = false;
        } catch {
            if (startedIn === generation) {
                olderFailed.value = true;
            }
        }
    }

    /**
     * Shows the newest first page in place of the open older pages.
     */
    function revealNew(): void {
        olderLoaded = false;
        hasNewItems.value = false;

        if (snapshot.value !== null) {
            list(snapshot.value);
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
        changesCursor = null;
        listed.value = [];
        olderCursor.value = null;
        olderFailed.value = false;
        hasNewItems.value = false;
        olderLoaded = false;
        pending.value = new Set();
        authorizedAt = 0;
        state.value = 'loading';
    }

    return {
        state,
        shown,
        items,
        hasOlder,
        olderFailed,
        hasNewItems,
        loadOlder,
        revealNew,
        pending,
        canChange,
        refresh,
        markRead: async (receiptId) => {
            await mark(receiptId, () => client.markRead(receiptId), () => isStillUnread(receiptId));
            showReadOlderRow(receiptId);
        },
        markAll: async () => {
            const through = snapshot.value?.through;

            if (through === undefined || through === null) {
                return;
            }

            await mark(MARK_ALL, () => client.markAll(through), () => snapshot.value !== null && snapshot.value.unread > 0);
        },
        markTargetRead: (targetKey, targetId) =>
            mark(
                `${targetKey}:${targetId}`,
                () => client.markTargetRead(targetKey, targetId),
                () => !isTargetRead(targetKey, targetId),
            ),
        catchUp,
        checkLease,
        purge,
    };
}
