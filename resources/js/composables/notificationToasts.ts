import type { NotificationItem } from '@/generated/types/core';
import type { ToastOutcome } from './toastStore';

/**
 * The toast a new arrival earns, if any: a run's failure or success and a report that is ready. Questions and merge
 * requests only raise the badge, an unknown run outcome is shown only in the bell, and a run already on screen at
 * its own address needs no toast.
 */
export function notificationToasts(items: NotificationItem[], currentUrl: string): ToastOutcome[] {
    return items.map((item) => toastOf(item, currentUrl)).filter((toast) => toast !== null);
}

export function toastOf(item: NotificationItem, currentUrl: string): ToastOutcome | null {
    const target = item.target;

    if (target === undefined || currentUrl.startsWith(target.url)) {
        return null;
    }

    if (target.key === 'report') {
        return { key: item.id, type: 'report', title: item.title, href: target.url };
    }

    if (target.key !== 'run' || item.title === 'Run outcome unknown') {
        return null;
    }

    if (currentUrl.startsWith(`/processes/runs/${target.id}`)) {
        return null;
    }

    return {
        key: item.id,
        type: item.title === 'Run failed' ? 'failure' : 'success',
        title: item.title,
        href: target.url,
    };
}
