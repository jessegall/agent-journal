import type { NotificationItem } from '@/generated/types/core';
import { onBeforeUnmount, onMounted } from 'vue';
import { LEASE_MILLISECONDS, notificationStore } from './notificationStore';
import type { NotificationStore } from './notificationStore';
import { notificationVisits } from './notificationVisits';
import { onPurge } from './protectedView';

/**
 * How often a visible tab reads its snapshot again, even while the live connection is healthy.
 */
const REFRESH_MILLISECONDS = LEASE_MILLISECONDS;

/**
 * How often a visible tab checks whether its snapshot outlived its lease.
 */
const LEASE_CHECK_MILLISECONDS = 1_000;

/**
 * The tab's one notification snapshot, cleared by every protected purge, including sign-out and a change of user.
 */
const store = notificationStore(notificationVisits);
onPurge(store.purge);

/**
 * Hands the new arrivals of a live change to whoever presents them; the shell's toasts register here.
 */
let presentArrivals: (arrivals: NotificationItem[]) => void = () => undefined;

export function onNotificationArrivals(present: (arrivals: NotificationItem[]) => void): void {
    presentArrivals = present;
}

/**
 * A live signal said the notifications changed: every tab catches up, and the new arrivals go to the presenter,
 * which decides whether this tab speaks.
 */
export function followNotificationsSignal(): void {
    void store.catchUp().then((arrivals) => presentArrivals(arrivals));
}

/**
 * After a reconnect the tab takes a fresh snapshot silently: what it missed is counted, never presented.
 */
export function reconcileNotifications(): void {
    void store.refresh();
}

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
