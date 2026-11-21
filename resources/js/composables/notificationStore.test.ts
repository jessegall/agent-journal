import type { NotificationPage } from '@/generated/types/core';
import { describe, expect, it, vi } from 'vitest';
import { LEASE_MILLISECONDS, NotificationRequestFailed, notificationStore } from './notificationStore';
import type { NotificationClient } from './notificationStore';

function pageOf(version: number, unread: number, readAt: string | null = null): NotificationPage {
    return {
        through: '1',
        version: String(version),
        unread,
        nextCursor: null,
        changesCursor: 'cursor',
        items: [
            {
                id: 'receipt-1',
                sequence: 1,
                readAt,
                title: 'Which port?',
                target: { key: 'chat.question', id: 'message-1', url: '/chat?question=message-1' },
            },
        ],
    };
}

function clientOf(overrides: Partial<NotificationClient>): NotificationClient {
    return {
        page: vi.fn(async () => pageOf(1, 1)),
        markRead: vi.fn(async () => pageOf(2, 0, '2026-11-22T10:00:00+00:00')),
        markQuestionRead: vi.fn(async () => pageOf(2, 0, '2026-11-22T10:00:00+00:00')),
        markTargetRead: vi.fn(async () => pageOf(2, 0, '2026-11-22T10:00:00+00:00')),
        changes: vi.fn(async () => ({ reset: true, version: '1', unread: 0, nextCursor: null, cursor: 'c', changes: [] })),
        ...overrides,
    };
}

describe('notificationStore', () => {
    it('shows a failure and no count when the first load fails', async () => {
        const store = notificationStore(clientOf({ page: vi.fn(async () => Promise.reject(new Error('down'))) }));

        await store.refresh();

        expect(store.state.value).toBe('failed');
        expect(store.shown.value).toBeNull();
    });

    it('keeps the loaded rows when a later refresh fails, and allows no change then', async () => {
        const page = vi.fn().mockResolvedValueOnce(pageOf(1, 1)).mockRejectedValueOnce(new Error('down'));
        const store = notificationStore(clientOf({ page }));

        await store.refresh();
        await store.refresh();

        expect(store.state.value).toBe('refreshFailed');
        expect(store.shown.value?.unread).toBe(1);
        expect(store.canChange.value).toBe(false);
    });

    it('ignores a reply older than the snapshot it holds', async () => {
        const page = vi.fn().mockResolvedValueOnce(pageOf(5, 0)).mockResolvedValueOnce(pageOf(3, 4));
        const store = notificationStore(clientOf({ page }));

        await store.refresh();
        await store.refresh();

        expect(store.shown.value?.version).toBe('5');
    });

    it('hides the snapshot once its lease runs out, until a refresh answers', async () => {
        let time = 0;
        const store = notificationStore(clientOf({}), () => time);

        await store.refresh();
        time = LEASE_MILLISECONDS;
        store.checkLease();

        expect(store.state.value).toBe('expired');
        expect(store.shown.value).toBeNull();

        await store.refresh();

        expect(store.shown.value?.unread).toBe(1);
    });

    it('drops every row, count and late reply after a purge', async () => {
        let answer: (page: NotificationPage) => void = () => undefined;
        const page = vi
            .fn()
            .mockResolvedValueOnce(pageOf(1, 1))
            .mockImplementationOnce(() => new Promise<NotificationPage>((resolve) => (answer = resolve)));
        const store = notificationStore(clientOf({ page }));

        await store.refresh();
        const late = store.refresh();
        store.purge();
        answer(pageOf(9, 7));
        await late;

        expect(store.shown.value).toBeNull();
        expect(store.state.value).toBe('loading');
        expect(store.pending.value.size).toBe(0);
    });

    it('reads again after a lost mark and retries only while the receipt is still unread', async () => {
        const markRead = vi.fn().mockRejectedValueOnce(new NotificationRequestFailed('lost'));
        const page = vi
            .fn()
            .mockResolvedValueOnce(pageOf(1, 1))
            .mockResolvedValueOnce(pageOf(2, 0, '2026-11-22T10:00:00+00:00'));
        const store = notificationStore(clientOf({ page, markRead }));

        await store.refresh();
        await store.markRead('receipt-1');

        expect(markRead).toHaveBeenCalledTimes(1);
        expect(store.shown.value?.unread).toBe(0);
        expect(store.pending.value.size).toBe(0);
    });

    it('retries a lost mark once when the receipt is still unread', async () => {
        const markRead = vi
            .fn()
            .mockRejectedValueOnce(new NotificationRequestFailed('lost'))
            .mockResolvedValueOnce(pageOf(3, 0, '2026-11-22T10:00:00+00:00'));
        const store = notificationStore(clientOf({ markRead }));

        await store.refresh();
        await store.markRead('receipt-1');

        expect(markRead).toHaveBeenCalledTimes(2);
        expect(store.shown.value?.unread).toBe(0);
    });

    it('catches up through every page and answers only still visible unread arrivals', async () => {
        const arrival = (id: string, readAt: string | null = null) => ({
            id,
            sequence: 1,
            readAt,
            title: `Run ${id}`,
            target: { key: 'run', id, url: `/processes/runs/${id}/outcome` },
        });
        const created = Array.from({ length: 21 }, (_, index) => ({
            version: String(index + 2),
            type: 'create' as const,
            receiptId: `r${index}`,
            item: arrival(`r${index}`),
        }));
        const changes = vi
            .fn()
            .mockResolvedValueOnce({
                reset: false, version: '22', unread: 21, nextCursor: 'next', cursor: 'next', changes: created.slice(0, 20),
            })
            .mockResolvedValueOnce({
                reset: false,
                version: '24',
                unread: 19,
                nextCursor: null,
                cursor: 'done',
                changes: [created[20], { version: '23', type: 'remove' as const, receiptId: 'r1' }],
            });
        const latest = {
            through: '21', version: '24', unread: 19, nextCursor: null, changesCursor: 'done',
            items: created.filter((change) => change.receiptId !== 'r1').map((change) =>
                change.receiptId === 'r0' ? arrival('r0', '2026-11-22T10:00:00+00:00') : change.item),
        };
        const page = vi.fn().mockResolvedValueOnce(pageOf(1, 0)).mockResolvedValueOnce(latest);
        const store = notificationStore(clientOf({ page, changes }));

        await store.refresh();
        const arrivals = await store.catchUp();

        expect(changes).toHaveBeenCalledTimes(2);
        expect(arrivals).toHaveLength(19);
        expect(arrivals.map((item) => item.id)).not.toContain('r1');
        expect(arrivals.map((item) => item.id)).not.toContain('r0');
        expect(store.shown.value?.unread).toBe(19);
    });

    it('takes a fresh snapshot without arrivals when the cursor is too old', async () => {
        const changes = vi.fn().mockResolvedValueOnce({
            reset: true, version: '9', unread: 3, nextCursor: null, cursor: 'fresh', changes: [],
        });
        const store = notificationStore(clientOf({ changes }));

        await store.refresh();

        expect(await store.catchUp()).toEqual([]);
    });
});
