import type { NotificationPage } from '@/generated/types/core';
import { xsrfToken } from '@/echo';
import { notifications } from '@/routes/communication';
import { read, readQuestion } from '@/routes/communication/notifications';
import { onBeforeUnmount, onMounted } from 'vue';
import {
    LEASE_MILLISECONDS,
    NotificationRequestFailed,
    notificationStore,
} from './notificationStore';
import type { NotificationClient, NotificationStore } from './notificationStore';
import { onPurge } from './protectedView';

/**
 * How often a visible tab reads its snapshot again, even while the live connection is healthy.
 */
const REFRESH_MILLISECONDS = LEASE_MILLISECONDS;

/**
 * How often a visible tab checks whether its snapshot outlived its lease.
 */
const LEASE_CHECK_MILLISECONDS = 1_000;

async function requestPage(url: string, init: RequestInit): Promise<NotificationPage> {
    let response: Response;

    try {
        response = await fetch(url, {
            credentials: 'same-origin',
            ...init,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': xsrfToken(),
            },
        });
    } catch {
        throw new NotificationRequestFailed('lost');
    }

    if (response.status >= 500) {
        throw new NotificationRequestFailed('lost');
    }

    if (!response.ok) {
        throw new NotificationRequestFailed('refused');
    }

    return (await response.json()) as NotificationPage;
}

const client: NotificationClient = {
    page: (cursor) =>
        requestPage(notifications.url(cursor === null ? undefined : { query: { cursor } }), { method: 'GET' }),
    markRead: (receiptId) =>
        requestPage(read.url(), { method: 'POST', body: JSON.stringify({ receiptId }) }),
    markQuestionRead: (messageId) =>
        requestPage(readQuestion.url(), { method: 'POST', body: JSON.stringify({ messageId }) }),
};

/**
 * The tab's one notification snapshot, cleared by every protected purge, including sign-out and a change of user.
 */
const store = notificationStore(client);
onPurge(store.purge);

let users = 0;
let refreshTimer: ReturnType<typeof setInterval> | undefined;
let leaseTimer: ReturnType<typeof setInterval> | undefined;

function stopTimers(): void {
    clearInterval(refreshTimer);
    clearInterval(leaseTimer);
    refreshTimer = undefined;
    leaseTimer = undefined;
}

function startTimers(): void {
    stopTimers();
    refreshTimer = setInterval(() => void store.refresh(), REFRESH_MILLISECONDS);
    leaseTimer = setInterval(store.checkLease, LEASE_CHECK_MILLISECONDS);
}

/**
 * A hidden tab runs no timer; a tab shown again checks its lease before it paints anything, then reads again.
 */
function followVisibility(): void {
    if (document.visibilityState !== 'visible') {
        stopTimers();

        return;
    }

    store.checkLease();
    startTimers();
    void store.refresh();
}

function refreshOnFocus(): void {
    void store.refresh();
}

/**
 * The shell's notification snapshot: read on mount, on focus, when the tab is shown again and every thirty seconds
 * while it is visible. Every component that mounts it shares the one store.
 */
export function useNotifications(): NotificationStore {
    onMounted(() => {
        users++;

        if (users > 1) {
            return;
        }

        document.addEventListener('visibilitychange', followVisibility);
        window.addEventListener('focus', refreshOnFocus);
        followVisibility();
    });
    onBeforeUnmount(() => {
        users--;

        if (users > 0) {
            return;
        }

        document.removeEventListener('visibilitychange', followVisibility);
        window.removeEventListener('focus', refreshOnFocus);
        stopTimers();
    });

    return store;
}
