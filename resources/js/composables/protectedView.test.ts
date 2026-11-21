import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';

const listeners = new Map<string, Array<(event: CustomEvent) => void>>();
const page = reactive({ url: '/home', props: { currentUser: { id: 'user-1' } as { id: string } | undefined } });

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
    router: {
        on: (name: string, listener: (event: CustomEvent) => void) => {
            listeners.set(name, [...(listeners.get(name) ?? []), listener]);

            return () => undefined;
        },
    },
}));

const { clearProtectedViews, isRevealed, onPurge, purge, trackProtectedRead } = await import('./protectedView');

let visitCount = 0;

function fire(name: string, visit: object): void {
    listeners.get(name)?.forEach((listener) => listener(new CustomEvent(name, { detail: { visit } })));
}

/**
 * Runs one visit that asked for these props and ended as given.
 */
function visit(only: string[], ending: { completed: boolean; cancelled?: boolean } = { completed: true }): void {
    const id = `visit-${++visitCount}`;
    fire('before', { id, only });
    fire('start', { id, only });
    fire('finish', { id, only, completed: ending.completed, cancelled: ending.cancelled ?? false, interrupted: false });
}

describe('protected views', () => {
    beforeEach(() => {
        purge();
        page.url = '/home';
        page.props.currentUser = { id: 'user-1' };
    });

    it('cancels a protected read still in flight when a newer visit starts, so its late answer is never installed', () => {
        const older = { cancel: vi.fn() };
        trackProtectedRead(older);

        fire('before', { id: 'newer', only: ['page'] });

        expect(older.cancel).toHaveBeenCalledOnce();
    });

    it('reveals only the props a successful visit asked for, so a counts-only reload leaves a dialog hidden', () => {
        visit(['navigationCounts']);

        expect(isRevealed('navigationCounts')).toBe(true);
        expect(isRevealed('inspector')).toBe(false);
    });

    it('hides protected props after a reconnect until a read that includes them succeeds', () => {
        visit(['page', 'inspector']);
        clearProtectedViews();

        expect(isRevealed('page')).toBe(false);
        visit(['navigationCounts']);
        expect(isRevealed('page')).toBe(false);
        visit(['page'], { completed: false, cancelled: true });
        expect(isRevealed('page')).toBe(false);
        visit(['page']);
        expect(isRevealed('page')).toBe(true);
        expect(isRevealed('inspector')).toBe(false);
    });

    it('reveals nothing for another user', () => {
        visit(['page']);

        page.props.currentUser = { id: 'user-2' };

        expect(isRevealed('page')).toBe(false);
    });

    it('clears what was revealed on a denial and calls every purger', () => {
        const purger = vi.fn();
        const stop = onPurge(purger);
        visit([]);
        expect(isRevealed('page')).toBe(true);

        purge();

        expect(isRevealed('page')).toBe(false);
        expect(purger).toHaveBeenCalledOnce();
        stop();
    });
});
