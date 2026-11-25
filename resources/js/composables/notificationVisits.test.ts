import { describe, expect, it, vi } from 'vitest';

type Sent = { loader: { key: string }; input: unknown };

const loads: Sent[] = [];
const posts: Array<{ url: string; data: unknown; options: unknown }> = [];
const answers: unknown[] = [];

vi.mock('@inertiajs/vue3', () => ({
    router: { post: (url: string, data: unknown, options: unknown) => posts.push({ url, data, options }) },
}));
vi.mock('@/routes/communication/notifications', () => ({
    read: { url: () => '/communication/notifications/read' },
    readAll: { url: () => '/communication/notifications/read-all' },
    readTarget: { url: () => '/communication/notifications/read-target' },
}));
vi.mock('@kit/loaders', () => {
    class LoaderFailed extends Error {
        constructor(public readonly status: number | null) {
            super('failed');
        }
    }

    const answer = () => {
        const next = answers.shift();

        return next instanceof Error ? Promise.reject(next) : Promise.resolve(next);
    };

    return {
        LoaderFailed,
        shellNotifications: { key: 'shell.notifications', prop: 'load_shell_notifications' },
        shellNotificationChanges: { key: 'shell.notification-changes', prop: 'load_shell_notification_changes' },
        load: (loader: { key: string }, input: unknown) => {
            loads.push({ loader, input });

            return answer();
        },
        loadAfter: (loader: { key: string }, input: unknown, send: (options: unknown) => void) => {
            loads.push({ loader, input });
            send({ only: [loader.key] });

            return answer();
        },
    };
});

const { notificationVisits } = await import('./notificationVisits');
const { NotificationRequestFailed } = await import('./notificationStore');
const { LoaderFailed } = await import('@kit/loaders');

describe('notificationVisits', () => {
    it('reads a page by its cursor and the changes since a cursor through the shell loaders', async () => {
        answers.push({ status: 'ok', value: { items: [] } }, { status: 'ok', value: { changes: [] } });

        await expect(notificationVisits.page('cursor-2')).resolves.toEqual({ items: [] });
        await expect(notificationVisits.changes('cursor-3')).resolves.toEqual({ changes: [] });
        expect(loads[0]).toEqual({ loader: expect.objectContaining({ key: 'shell.notifications' }), input: { cursor: 'cursor-2' } });
        expect(loads[1]).toEqual({
            loader: expect.objectContaining({ key: 'shell.notification-changes' }),
            input: { since: 'cursor-3' },
        });
    });

    it('marks by a post whose redirect answers the newest head, and settles a refusal and a lost answer', async () => {
        loads.length = 0;
        answers.push(
            { status: 'ok', value: { unread: 0 } },
            { status: 'invalid', errors: { receiptId: 'unknown' } },
            new LoaderFailed(503),
        );

        await expect(notificationVisits.markAll('41')).resolves.toEqual({ unread: 0 });
        await expect(notificationVisits.markRead('receipt-1')).rejects.toEqual(new NotificationRequestFailed('refused'));
        await expect(notificationVisits.markTargetRead('ask', 'ask-1')).rejects.toEqual(
            new NotificationRequestFailed('lost'),
        );
        expect(posts[0]).toMatchObject({ url: '/communication/notifications/read-all', data: { through: 41 } });
        expect(loads[0].input).toEqual({ cursor: null });
    });
});
