import type { VisitOptions } from '@inertiajs/core';
import type { NotificationChangePage, NotificationPage } from '@/generated/types/core';
import { read, readAll, readQuestion, readTarget } from '@/routes/communication/notifications';
import { router } from '@inertiajs/vue3';
import { NotificationRequestFailed } from './notificationStore';
import type { NotificationClient } from './notificationStore';

/**
 * The shell props the bell reads; the server includes each only when a partial reload names it.
 */
const NOTIFICATIONS = 'notifications';
const CHANGES = 'notificationChanges';

/**
 * Runs one visit that reloads only the prop, without holding up or replacing anything else on the page, and settles
 * with what the server answered for it: a refusal is refused, a server failure or a lost answer is lost.
 */
function reloadOnly<T>(prop: string, visit: (options: VisitOptions) => void): Promise<T> {
    return new Promise((resolve, reject) => {
        visit({
            only: [prop],
            async: true,
            preserveState: true,
            preserveScroll: true,
            preserveUrl: true,
            onSuccess: (page) => resolve(page.props[prop] as T),
            onError: () => reject(new NotificationRequestFailed('refused')),
            onHttpException: (response) => {
                reject(new NotificationRequestFailed(response.status >= 500 ? 'lost' : 'refused'));

                return false;
            },
            onNetworkError: () => {
                reject(new NotificationRequestFailed('lost'));

                return false;
            },
            onCancel: () => reject(new NotificationRequestFailed('lost')),
        });
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
    markQuestionRead: (messageId) => markedThen(readQuestion.url(), { messageId }),
    markTargetRead: (targetKey, targetId) => markedThen(readTarget.url(), { targetKey, targetId }),
    markAll: (through) => markedThen(readAll.url(), { through: Number(through) }),
};
