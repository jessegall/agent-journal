// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';

type Handler = (event: { detail: Record<string, unknown> }) => void;

const handlers: Record<string, Handler> = {};
const calls: string[] = [];
const visits: string[] = [];

window.history.replaceState(null, '', '/tasks?project=01jd8x0g9m3qz6v4k2t7r5w1ca');

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => ({ props: { projects: [] } }),
    router: {
        on: (name: string, handler: Handler) => (handlers[name] = handler),
        cancelAll: () => calls.push('cancelAll'),
        visit: (address: string) => {
            calls.push('visit');
            visits.push(address);
        },
    },
}));

const { addressWith, followProjectChoice, projectOfAddress, useProject } = await import('./useProject');

followProjectChoice();

function headersOfNextVisit(): Record<string, string> {
    const visit = { headers: {} as Record<string, string> };
    handlers.before({ detail: { visit } });

    return visit.headers;
}

describe('useProject', () => {
    it('reads the choice from the address the tab opened at and names it on every visit', () => {
        expect(useProject().chosen.value).toBe('01jd8x0g9m3qz6v4k2t7r5w1ca');
        expect(headersOfNextVisit()).toEqual({ 'X-Journal-Project': '01jd8x0g9m3qz6v4k2t7r5w1ca' });
    });

    it('drops the visits under way, then opens the same page at its start under the new choice', () => {
        window.history.replaceState(null, '', '/tasks?cursor=abc&project=01jd8x0g9m3qz6v4k2t7r5w1ca');

        useProject().choose('01jd8x0g9m3qz6v4k2t7r5w1cb');

        expect(calls).toEqual(['cancelAll', 'visit']);
        expect(visits).toEqual(['/tasks?project=01jd8x0g9m3qz6v4k2t7r5w1cb']);
        expect(headersOfNextVisit()).toEqual({ 'X-Journal-Project': '01jd8x0g9m3qz6v4k2t7r5w1cb' });
    });

    it('keeps the choice in the address after a link that named none', () => {
        window.history.replaceState(null, '', '/plans/7');

        handlers.navigate({ detail: { type: 'visit', page: { url: '/plans/7' } } });

        expect(projectOfAddress(window.location.href)).toBe('01jd8x0g9m3qz6v4k2t7r5w1cb');
    });

    it('takes the earlier choice back on Back, and All projects names no header', () => {
        handlers.navigate({ detail: { type: 'history', page: { url: '/tasks' } } });

        expect(useProject().chosen.value).toBeNull();
        expect(headersOfNextVisit()).toEqual({});
    });

    it('writes an address for one project and for every project', () => {
        expect(addressWith('/tasks?project=a', null)).toBe('/tasks');
        expect(addressWith('/tasks', 'b')).toBe('/tasks?project=b');
    });
});
