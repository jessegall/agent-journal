import type { VisitOptions } from '@inertiajs/core';
import type { NotificationChangePage, NotificationPage } from '@/types/generated';
import { read, readAll, readTarget } from '@/routes/communication/notifications';
import { router } from '@inertiajs/vue3';
import { PropReadFailed, reloadProp } from '@kit/pageReads';
import { NotificationRequestFailed } from './notificationStore';
import type { NotificationClient } from './notificationStore';

/**
 * The shell props the bell reads; the server includes each only when a partial reload names it.
 */
const NOTIFICATIONS = 'notifications';
const CHANGES = 'notificationChanges';

/**
 * The bell's failures in its store's words: a refusal is refused, a server failure or a lost answer is lost.
 */
function reloadOnly<T>(prop: string, visit: (options: VisitOptions) => void): Promise<T> {
    return reloadProp<T>(prop, visit).catch((failure: PropReadFailed) => {
        throw new NotificationRequestFailed(failure.status === null || failure.status >= 500 ? 'lost' : 'refused');
    });
}

function markedThen(url: string, data: Record<string, string | number>): Promise<NotificationPage> {
    return reloadOnly(NOTIFICATIONS, (options) => router.post(url, data, options));
}

/**
 * The bell's server calls as Inertia visits: reads are partial reloads of the shell's notification props, and each
 * mark posts and comes back to the page with its newest notifications.
 */
export const notificationVisits: NotificationClient = {
    page: (cursor) =>
        reloadOnly(NOTIFICATIONS, (options) =>
            router.reload({ ...options, data: cursor === null ? {} : { notificationsCursor: cursor } }),
        ),
    changes: (cursor) =>
        reloadOnly<NotificationChangePage>(CHANGES, (options) =>
            router.reload({ ...options, data: { notificationsSince: cursor } }),
        ),
    markRead: (receiptId) => markedThen(read.url(), { receiptId }),
    markTargetRead: (targetKey, targetId) => markedThen(readTarget.url(), { targetKey, targetId }),
    markAll: (through) => markedThen(readAll.url(), { through: Number(through) }),
};
