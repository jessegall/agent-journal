import { describe, expect, it, vi } from 'vitest';

type Options = Record<string, unknown> & {
    onSuccess: (page: { props: Record<string, unknown> }) => void;
    onError: () => void;
    onHttpException: (response: { status: number }) => boolean;
    onNetworkError: () => boolean;
};

const reloads: Options[] = [];
const posts: Array<{ url: string; data: unknown; options: Options }> = [];

vi.mock('@inertiajs/vue3', () => ({
    router: {
        reload: (options: Options) => reloads.push(options),
        post: (url: string, data: unknown, options: Options) => posts.push({ url, data, options }),
    },
}));
vi.mock('@/routes/communication/notifications', () => ({
    read: { url: () => '/communication/notifications/read' },
    readAll: { url: () => '/communication/notifications/read-all' },
    readQuestion: { url: () => '/communication/notifications/read-question' },
    readTarget: { url: () => '/communication/notifications/read-target' },
}));

const { notificationVisits } = await import('./notificationVisits');
const { NotificationRequestFailed } = await import('./notificationStore');

describe('notificationVisits', () => {
    it('reads a page and the changes by partial reloads of their own prop, holding nothing else up', async () => {
        const page = notificationVisits.page('cursor-2');
        reloads[0].onSuccess({ props: { notifications: { items: [] } } });
        const changes = notificationVisits.changes('cursor-3');
        reloads[1].onSuccess({ props: { notificationChanges: { changes: [] } } });

        await expect(page).resolves.toEqual({ items: [] });
        await expect(changes).resolves.toEqual({ changes: [] });
        expect(reloads[0]).toMatchObject({
            only: ['notifications'],
            async: true,
            preserveState: true,
            preserveUrl: true,
            data: { notificationsCursor: 'cursor-2' },
        });
        expect(reloads[1]).toMatchObject({ only: ['notificationChanges'], data: { notificationsSince: 'cursor-3' } });
    });

    it('marks by a post that comes back with the newest notifications, and settles a refusal and a lost answer', async () => {
        const marked = notificationVisits.markAll('41');
        posts[0].options.onSuccess({ props: { notifications: { unreadCount: 0 } } });
        const refused = notificationVisits.markRead('receipt-1');
        posts[1].options.onError();
        const lost = notificationVisits.markQuestionRead('message-1');
        const showsErrorPage = posts[2].options.onHttpException({ status: 503 });

        await expect(marked).resolves.toEqual({ unreadCount: 0 });
        expect(posts[0]).toMatchObject({ url: '/communication/notifications/read-all', data: { through: 41 } });
        expect(posts[0].options.only).toEqual(['notifications']);
        await expect(refused).rejects.toEqual(new NotificationRequestFailed('refused'));
        await expect(lost).rejects.toEqual(new NotificationRequestFailed('lost'));
        expect(showsErrorPage).toBe(false);
    });
});
