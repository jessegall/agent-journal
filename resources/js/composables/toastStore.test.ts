import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INDIVIDUAL_LIMIT, SUCCESS_MILLISECONDS, toastStore } from './toastStore';
import type { ToastOutcome } from './toastStore';

function outcome(number: number, type: ToastOutcome['type'] = 'success'): ToastOutcome {
    return { key: `run-${number}`, type, title: `Run ${number} finished`, href: `/processes/runs/${number}/outcome` };
}

describe('toastStore', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('lets a success leave after eight seconds but keeps it while hovered', () => {
        const store = toastStore(() => Date.now());
        store.show(outcome(1));
        store.hold('run-1', 'hover');

        vi.advanceTimersByTime(SUCCESS_MILLISECONDS + 1);
        expect(store.toasts.value).toHaveLength(1);

        store.release('run-1', 'hover');
        vi.advanceTimersByTime(SUCCESS_MILLISECONDS + 1);
        expect(store.toasts.value).toHaveLength(0);
    });

    it('keeps a failure until it is dismissed', () => {
        const store = toastStore(() => Date.now());
        store.show(outcome(1, 'failure'));

        vi.advanceTimersByTime(SUCCESS_MILLISECONDS * 3);

        expect(store.toasts.value).toHaveLength(1);
    });

    it('shows ten successes as two toasts and a summary, announced once', () => {
        const store = toastStore(() => Date.now());

        for (let number = 1; number <= 10; number++) {
            store.show(outcome(number));
        }

        vi.advanceTimersByTime(400);

        expect(store.toasts.value).toHaveLength(INDIVIDUAL_LIMIT);
        expect(store.summary.value).toHaveLength(8);
        expect(store.announcement.value).toBe('10 new outcomes');
    });

    it('never evicts a shown toast for a burst', () => {
        const store = toastStore(() => Date.now());
        store.show(outcome(1, 'failure'));
        store.show(outcome(2, 'failure'));
        store.hold('run-1', 'focus');

        for (let number = 3; number <= 7; number++) {
            store.show(outcome(number));
        }

        expect(store.toasts.value.map((toast) => toast.key)).toEqual(['run-1', 'run-2']);
        expect(store.summary.value).toHaveLength(5);
    });

    it('clears everything on quiet and admits nothing until resumed', () => {
        const store = toastStore(() => Date.now());
        store.show(outcome(1));
        store.quiet();
        store.show(outcome(2));
        vi.advanceTimersByTime(400);

        expect(store.toasts.value).toHaveLength(0);
        expect(store.announcement.value).toBe('');

        store.resume();
        store.show(outcome(3));

        expect(store.toasts.value.map((toast) => toast.key)).toEqual(['run-3']);
    });
});
