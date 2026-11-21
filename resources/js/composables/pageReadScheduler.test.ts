import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PageReadEnd } from './usePageChanges';
import { PageReadScheduler } from './usePageChanges';

vi.mock('@inertiajs/vue3', () => ({ router: { reload: vi.fn(), on: vi.fn() }, usePage: vi.fn() }));
vi.mock('@/routes', () => ({ login: () => ({ url: '/login', method: 'get' }) }));

/**
 * A page read that stays open until the test ends it, counting how many were started.
 */
function heldRead() {
    const open: Array<(end: PageReadEnd) => void> = [];
    const read = vi.fn((ended: (end: PageReadEnd) => void) => {
        open.push(ended);
    });

    return {
        read,
        end(end: PageReadEnd): void {
            open.shift()?.(end);
        },
    };
}

describe('PageReadScheduler', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('reads at once on the first signal, without a pause', () => {
        const scheduler = new PageReadScheduler();
        const page = heldRead();
        scheduler.host(page.read);

        scheduler.markDirty('signal');

        expect(page.read).toHaveBeenCalledTimes(1);
        expect(scheduler.status.value).toBe('reading');
    });

    it('turns ten signals during a read into exactly one trailing read', () => {
        const scheduler = new PageReadScheduler();
        const page = heldRead();
        scheduler.host(page.read);
        scheduler.markDirty('signal');

        for (let count = 0; count < 10; count++) {
            scheduler.markDirty('signal');
        }

        expect(page.read).toHaveBeenCalledTimes(1);
        page.end('applied');
        expect(page.read).toHaveBeenCalledTimes(2);
        page.end('applied');
        expect(page.read).toHaveBeenCalledTimes(2);
        expect(scheduler.status.value).toBe('idle');
        expect(scheduler.appliedGeneration.value).toBe(11);
    });

    it('waits for a form being sent and reads when it finishes', () => {
        const scheduler = new PageReadScheduler();
        const page = heldRead();
        scheduler.host(page.read);
        scheduler.formStarted();

        scheduler.markDirty('signal');
        expect(page.read).not.toHaveBeenCalled();

        scheduler.formFinished();
        expect(page.read).toHaveBeenCalledTimes(1);
    });

    it('keeps a change marked before the page mounted and reads it when the page mounts', () => {
        const scheduler = new PageReadScheduler();
        const page = heldRead();

        scheduler.markDirty('signal');
        scheduler.host(page.read);

        expect(page.read).toHaveBeenCalledTimes(1);
    });

    it('retries a failing read after 1, 2 and 4 seconds, then waits for Retry', () => {
        const scheduler = new PageReadScheduler();
        const page = heldRead();
        scheduler.host(page.read);
        scheduler.markDirty('signal');

        for (const delay of [1000, 2000, 4000]) {
            page.end('failed');
            expect(scheduler.status.value).toBe('retrying');
            vi.advanceTimersByTime(delay - 1);
            const before = page.read.mock.calls.length;
            vi.advanceTimersByTime(1);
            expect(page.read).toHaveBeenCalledTimes(before + 1);
        }

        page.end('failed');
        expect(scheduler.status.value).toBe('failed');
        vi.advanceTimersByTime(60_000);
        scheduler.markDirty('signal');
        expect(page.read).toHaveBeenCalledTimes(4);

        scheduler.retry();
        expect(page.read).toHaveBeenCalledTimes(5);
        page.end('applied');
        expect(scheduler.status.value).toBe('idle');
    });

    it('reads again when the window regains focus after a failure', () => {
        const scheduler = new PageReadScheduler();
        const page = heldRead();
        scheduler.host(page.read);
        scheduler.markDirty('signal');

        for (const delay of [1000, 2000, 4000]) {
            page.end('failed');
            vi.advanceTimersByTime(delay);
        }

        page.end('failed');
        scheduler.markDirty('focus');

        expect(page.read).toHaveBeenCalledTimes(5);
    });

    it('releases the read once when it ends twice, and a cancelled read keeps the page dirty', () => {
        const scheduler = new PageReadScheduler();
        let ended: ((end: PageReadEnd) => void) | undefined;
        const read = vi.fn((end: (end: PageReadEnd) => void) => {
            ended = end;
        });
        scheduler.host(read);
        scheduler.markDirty('signal');

        ended?.('cancelled');
        ended?.('cancelled');

        expect(read).toHaveBeenCalledTimes(1);
        expect(scheduler.appliedGeneration.value).toBe(0);
        scheduler.host(read);
        expect(read).toHaveBeenCalledTimes(2);
    });
});
