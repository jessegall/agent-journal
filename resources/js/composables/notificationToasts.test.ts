import type { NotificationItem } from '@/generated/types/core';
import { describe, expect, it } from 'vitest';
import { notificationToasts } from './notificationToasts';

function item(id: string, key: string, title: string): NotificationItem {
    return { id, sequence: 1, readAt: null, title, target: { key, id: '7', url: `/x/${id}` } };
}

describe('notificationToasts', () => {
    it('toasts run results and reports, and never questions, merge requests or unknown outcomes', () => {
        const toasts = notificationToasts(
            [
                item('a', 'run', 'Run failed'),
                item('b', 'run', 'Run finished'),
                item('c', 'run', 'Run outcome unknown'),
                item('d', 'report', 'Findings, from Birch'),
                item('e', 'chat.question', 'Which port?'),
                item('f', 'merge.ask', 'Merge request: main'),
            ],
            '/home',
        );

        expect(toasts.map((toast) => [toast.key, toast.type])).toEqual([
            ['a', 'failure'],
            ['b', 'success'],
            ['d', 'report'],
        ]);
    });

    it('does not toast a run already on screen', () => {
        expect(notificationToasts([item('a', 'run', 'Run failed')], '/processes/runs/7')).toEqual([]);
    });
});
