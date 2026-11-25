import type { VisitOptions } from '@inertiajs/core';
import type { NotificationChangePage, NotificationPage } from '@/types/generated';
import { read, readAll, readTarget } from '@/routes/communication/notifications';
import { router } from '@inertiajs/vue3';
import { LoaderFailed, load, loadAfter, shellNotificationChanges, shellNotifications } from '@kit/loaders';
import type { LoaderAnswer } from '@kit/loaders';
import { NotificationRequestFailed } from './notificationStore';
import type { NotificationClient } from './notificationStore';

/**
 * The bell's answers in its store's words: an Invalid or Unavailable answer is refused, a server failure or a lost
 * answer is lost.
 */
async function answered<T>(call: Promise<LoaderAnswer<T>>): Promise<T> {
    const answer = await call.catch((failure: unknown) => {
        if (!(failure instanceof LoaderFailed)) {
            throw failure;
        }

        throw new NotificationRequestFailed(failure.status === null || failure.status >= 500 ? 'lost' : 'refused');
    });

    if (answer.status !== 'ok') {
        throw new NotificationRequestFailed('refused');
    }

    return answer.value;
}

/**
 * Posts a mark; the redirect back answers the newest notifications in the same visit.
 */
function markedThen(url: string, data: Record<string, string | number>): Promise<NotificationPage> {
    return answered(
        loadAfter(shellNotifications, { cursor: null }, (options: VisitOptions) => router.post(url, data, options)),
    );
}

/**
 * The bell's server calls through the shell's loaders: a page by its cursor, the changes since a cursor, and each mark
 * as a post that comes back with the newest page.
 */
export const notificationVisits: NotificationClient = {
    page: (cursor) => answered(load(shellNotifications, { cursor })),
    changes: (cursor): Promise<NotificationChangePage> => answered(load(shellNotificationChanges, { since: cursor })),
    markRead: (receiptId) => markedThen(read.url(), { receiptId }),
    markTargetRead: (targetKey, targetId) => markedThen(readTarget.url(), { targetKey, targetId }),
    markAll: (through) => markedThen(readAll.url(), { through: Number(through) }),
};
