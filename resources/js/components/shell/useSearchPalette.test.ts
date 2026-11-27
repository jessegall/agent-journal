// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Answer = { status: string; hits: { recordId: string }[]; continuation: string | null; hints: string[] };
type Loaded = { status: 'ok'; value: Answer } | { status: 'invalid'; errors: Record<string, string> };

const answers: Array<(loaded: Loaded) => void> = [];
const asked: Record<string, unknown>[] = [];
const purgers: Array<() => void> = [];

vi.mock('@/composables/protectedView', () => ({
    onPurge: (purger: () => void) => {
        purgers.push(purger);

        return () => undefined;
    },
}));

vi.mock('@/kit/loaders', () => ({
    LoaderFailed: class extends Error {},
    shellSearch: { key: 'shell.search', prop: 'load_shell_search' },
    shellSearchSources: { key: 'shell.search-sources', prop: 'load_shell_search_sources' },
    load: (loader: { key: string }, input: Record<string, unknown>) =>
        new Promise((resolve) => {
            if (loader.key === 'shell.search-sources') {
                resolve({ status: 'ok', value: { prefix: '', sources: [], nextAfter: null } });

                return;
            }
            asked.push(input);
            answers.push(resolve as (loaded: Loaded) => void);
        }),
}));

const { SEARCH_DEBOUNCE_MS, useSearchPalette } = await import('./useSearchPalette');

function hit(id: string) {
    return { recordId: id };
}

function ok(value: Answer): Loaded {
    return { status: 'ok', value };
}

describe('the search palette reads', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        answers.length = 0;
        asked.length = 0;
        purgers.length = 0;
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
        expect(asked).toEqual([{ query: 'dri', within: null, limit: null, continuation: null }]);
    });

    it('drops an answer that arrives after a newer read started', async () => {
        const search = useSearchPalette();
        search.words.value = 'old';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
        search.words.value = 'new';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

        answers[1](ok({ status: 'complete', hits: [hit('new')], continuation: null, hints: [] }));
        answers[0](ok({ status: 'complete', hits: [hit('old')], continuation: null, hints: [] }));
        await vi.runAllTimersAsync();

        expect(search.hits.value.map((found) => found.recordId)).toEqual(['new']);
    });

    it('drops an answer that arrives after the palette closed', async () => {
        const search = useSearchPalette();
        search.words.value = 'late';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
        search.reset();

        answers[0](ok({ status: 'complete', hits: [hit('late')], continuation: null, hints: [] }));
        await vi.runAllTimersAsync();

        expect(search.answer.value).toBeNull();
        expect(search.hits.value).toEqual([]);
    });

    it('follows a pending search until it stalls and appends hits in order', async () => {
        const search = useSearchPalette();
        search.words.value = 'driver';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

        answers[0](ok({ status: 'pending', hits: [hit('a')], continuation: 'c1', hints: [] }));
        await vi.runAllTimersAsync();
        answers[1](ok({ status: 'more', hits: [hit('b')], continuation: 'c2', hints: [] }));
        await vi.runAllTimersAsync();

        expect(asked[1]).toEqual({ query: '', within: null, limit: null, continuation: 'c1' });
        expect(search.hits.value.map((found) => found.recordId)).toEqual(['a', 'b']);
        expect(answers).toHaveLength(2);
    });

    it('shows the empty result when the search finds nothing', async () => {
        const search = useSearchPalette();
        search.words.value = 'nothing';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

        answers[0](ok({ status: 'complete', hits: [], continuation: null, hints: [] }));
        await vi.runAllTimersAsync();

        expect(search.hits.value).toEqual([]);
        expect(search.answer.value?.status).toBe('complete');
        expect(search.failed.value).toBe(false);
    });

    it('starts from the first page when the server refuses a continuation', async () => {
        const search = useSearchPalette();
        search.words.value = 'driver';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
        answers[0](ok({ status: 'more', hits: [hit('a')], continuation: 'c1', hints: [] }));
        await vi.runAllTimersAsync();

        void search.continueSearch('c1');
        answers[1]({ status: 'invalid', errors: { continuation: 'unreadable' } });
        await vi.runAllTimersAsync();

        expect(asked[2]).toEqual({ query: 'driver', within: null, limit: null, continuation: null });
    });

    it('searches the same words again after a purge', async () => {
        const search = useSearchPalette();
        search.words.value = 'driver';
        search.searchSoon();
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
        answers[0](ok({ status: 'complete', hits: [hit('a')], continuation: null, hints: [] }));
        await vi.runAllTimersAsync();

        purgers.forEach((purger) => purger());
        expect(search.hits.value).toEqual([]);
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

        expect(asked).toHaveLength(2);
    });
});
