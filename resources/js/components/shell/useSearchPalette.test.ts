// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Answer = { status: string; hits: { recordId: string }[]; continuation: string | null; hints: string[] };

const answers: Array<(value: Answer) => void> = [];
const asked: Record<string, unknown>[] = [];

vi.mock('@inertiajs/vue3', () => ({
    router: {
        reload: (options: { data: Record<string, unknown> }) => {
            asked.push(options.data);
        },
    },
}));

vi.mock('@/kit/pageReads', () => ({
    PropReadFailed: class extends Error {},
    reloadProp: (prop: string, visit: (options: Record<string, unknown>) => void) =>
        new Promise((resolve) => {
            visit({});
            if (prop === 'searchSources') {
                resolve({ prefix: '', sources: [], nextAfter: null });

                return;
            }
            answers.push(resolve as (value: Answer) => void);
        }),
}));

const { SEARCH_DEBOUNCE_MS, useSearchPalette } = await import('./useSearchPalette');

function hit(id: string) {
    return { recordId: id };
}

describe('the search palette reads', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        answers.length = 0;
        asked.length = 0;
    });

    afterEach(() => vi.useRealTimers());

    it('searches once, 200 ms after the last keystroke', () => {
        const search = useSearchPalette();
        search.words.value = 'dr';
        search.searchSoon();
        search.words.value = 'dri';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1);
        expect(asked).toHaveLength(0);
        vi.advanceTimersByTime(1);
        expect(asked).toEqual([{ searchQuery: 'dri' }]);
    });

    it('drops an answer that arrives after a newer read started', async () => {
        const search = useSearchPalette();
        search.words.value = 'old';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
        search.words.value = 'new';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

        answers[1]({ status: 'complete', hits: [hit('new')], continuation: null, hints: [] });
        answers[0]({ status: 'complete', hits: [hit('old')], continuation: null, hints: [] });
        await vi.runAllTimersAsync();

        expect(search.hits.value.map((found) => found.recordId)).toEqual(['new']);
    });

    it('drops an answer that arrives after the palette closed', async () => {
        const search = useSearchPalette();
        search.words.value = 'late';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
        search.reset();

        answers[0]({ status: 'complete', hits: [hit('late')], continuation: null, hints: [] });
        await vi.runAllTimersAsync();

        expect(search.answer.value).toBeNull();
        expect(search.hits.value).toEqual([]);
    });

    it('follows a pending search until it stalls and appends hits in order', async () => {
        const search = useSearchPalette();
        search.words.value = 'driver';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

        answers[0]({ status: 'pending', hits: [hit('a')], continuation: 'c1', hints: [] });
        await vi.runAllTimersAsync();
        answers[1]({ status: 'more', hits: [hit('b')], continuation: 'c2', hints: [] });
        await vi.runAllTimersAsync();

        expect(asked[1]).toEqual({ searchContinuation: 'c1' });
        expect(search.hits.value.map((found) => found.recordId)).toEqual(['a', 'b']);
        expect(answers).toHaveLength(2);
    });
});
