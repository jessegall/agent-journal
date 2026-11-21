// @vitest-environment happy-dom
import type { NotificationPage } from '@/generated/types/core';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { NotificationLoadState } from '@/composables/notificationStore';
import NotificationList from './NotificationList.vue';

function pageOf(unread: number, readAt: string | null): NotificationPage {
    return {
        through: '1',
        version: '1',
        unread,
        nextCursor: null,
        changesCursor: 'cursor',
        items: [
            {
                id: 'receipt-1',
                sequence: 1,
                readAt,
                title: '<b>Which port?</b>',
                target: { key: 'chat.question', id: 'message-1', url: '/chat?question=message-1' },
            },
        ],
    };
}

function listOf(state: NotificationLoadState, page: NotificationPage | null) {
    return mount(NotificationList, {
        props: { id: 'panel', state, page, pending: new Set<string>(), canChange: true, lastOpenedId: undefined },
    });
}

describe('NotificationList', () => {
    it('says there are no notifications yet for an empty history', () => {
        const list = listOf('loaded', {
            through: null,
            version: '0',
            unread: 0,
            nextCursor: null,
            changesCursor: '',
            items: [],
        });

        expect(list.text()).toContain('No notifications yet');
    });

    it('shows a failed first load with Retry and never an empty list', () => {
        const list = listOf('failed', null);

        expect(list.text()).toContain("Couldn't load notifications");
        expect(list.text()).not.toContain('No notifications yet');
        expect(list.find('button').text()).toBe('Retry');
    });

    it('gives an unread row an Open link and a Mark read button, its title as literal text', async () => {
        const list = listOf('loaded', pageOf(1, null));

        expect(list.find('a[data-open="receipt-1"]').attributes('href')).toBe('/chat?question=message-1');
        expect(list.text()).toContain('<b>Which port?</b>');
        expect(list.find('b').exists()).toBe(false);

        await list.find('button').trigger('click');

        expect(list.emitted('read')).toEqual([['receipt-1']]);
    });

    it('keeps a read row and says all caught up', () => {
        const list = listOf('loaded', pageOf(0, '2026-11-22T10:00:00+00:00'));

        expect(list.text()).toContain('All caught up');
        expect(list.find('a[data-open="receipt-1"]').exists()).toBe(true);
        expect(list.findAll('button')).toHaveLength(0);
    });

    it('keeps the rows when a refresh failed', () => {
        const list = listOf('refreshFailed', pageOf(1, null));

        expect(list.text()).toContain("Couldn't refresh notifications");
        expect(list.find('a[data-open="receipt-1"]').exists()).toBe(true);
    });
});
