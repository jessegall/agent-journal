import { onBeforeUnmount, ref } from 'vue';
import { onPurge } from '@/composables/protectedView';
import { LoaderFailed, load, shellSearch, shellSearchSources } from '@/kit/loaders';
import type { PaletteHitData, PaletteSearchData, PaletteSourceData, SearchInput } from '@/types/generated';

/**
 * The milliseconds the palette waits after the last keystroke before it searches.
 */
export const SEARCH_DEBOUNCE_MS = 200;

/**
 * The fewest characters the palette searches for; shorter words read only the hints and the scope picker.
 */
export const MINIMUM_CHARACTERS = 2;

/**
 * The answers in a row a pending search may advance through without a new hit before the palette stops asking.
 */
export const STALLED_ANSWERS = 3;

/**
 * The statuses whose continuation the palette follows by itself, one read after another, while it is open.
 */
const ADVANCING = ['pending'];

/**
 * The palette's reads of the common search service: the scope picker's sources for a prefix, and a search for words
 * within an optional scope, both through the shell's loaders, so the words travel in a header and never in the
 * address. Each read carries a number; an answer that arrives after a newer read started, or after the palette closed,
 * is dropped, so a late answer never moves the focus, the selection or reopens the dialog.
 */
export function useSearchPalette() {
    const words = ref('');
    const within = ref<PaletteSourceData | null>(null);
    const answer = ref<PaletteSearchData | null>(null);
    const hits = ref<PaletteHitData[]>([]);
    const added = ref(0);
    const sources = ref<PaletteSourceData[]>([]);
    const loading = ref(false);
    const failed = ref(false);
    let current = 0;
    let currentSources = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function next(): number {
        current += 1;

        return current;
    }

    function cancel(): void {
        next();

        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }

        loading.value = false;
    }

    async function readSources(prefix: string): Promise<void> {
        currentSources += 1;
        const asked = currentSources;

        try {
            const loaded = await load(shellSearchSources, { prefix, after: null });

            if (asked === currentSources && loaded.status === 'ok') {
                sources.value = loaded.value.sources;
            }
        } catch (error) {
            if (!(error instanceof LoaderFailed)) {
                throw error;
            }
        }
    }

    function firstPage(): SearchInput {
        return { query: words.value, within: within.value?.key ?? null, limit: null, continuation: null };
    }

    function nextPage(continuation: string): SearchInput {
        return { query: null, within: null, limit: null, continuation };
    }

    /**
     * Reads one page of the search; a continuation the server no longer reads starts again from the first page.
     */
    async function read(input: SearchInput, appending: boolean, idle = 0): Promise<void> {
        const asked = next();
        loading.value = true;
        failed.value = false;

        try {
            const loaded = await load(shellSearch, input);

            if (asked !== current) {
                return;
            }

            if (loaded.status !== 'ok') {
                restart(input, asked);

                return;
            }

            const found = loaded.value;
            answer.value = found;
            hits.value = appending ? [...hits.value, ...found.hits] : found.hits;
            added.value = found.hits.length;
            advance(found, asked, found.hits.length === 0 ? idle + 1 : 0);
        } catch (error) {
            if (!(error instanceof LoaderFailed)) {
                throw error;
            }

            if (asked === current) {
                failed.value = true;
            }
        } finally {
            if (asked === current) {
                loading.value = false;
            }
        }
    }

    /**
     * Reads the first page again after the server refused a continuation; a refused first page shows the empty result.
     */
    function restart(input: SearchInput, asked: number): void {
        if (input.continuation === null) {
            answer.value = null;
            hits.value = [];
            added.value = 0;

            return;
        }

        if (asked === current) {
            void read(firstPage(), false);
        }
    }

    /**
     * Follows a pending answer's continuation by itself, one read after another, while this read is still the current
     * one; it stops once the answers stall without a new hit.
     */
    function advance(found: PaletteSearchData, asked: number, idle: number): void {
        if (!ADVANCING.includes(found.status) || found.continuation === null || idle >= STALLED_ANSWERS) {
            return;
        }

        if (asked === current) {
            void read(nextPage(found.continuation), true, idle);
        }
    }

    /**
     * Searches the words after the debounce, superseding any read still on its way.
     */
    function searchSoon(): void {
        cancel();

        timer = setTimeout(() => {
            timer = null;
            void read(firstPage(), false);
        }, SEARCH_DEBOUNCE_MS);
    }

    /**
     * Reads the next page of the search the last answer continues.
     */
    function continueSearch(continuation: string): Promise<void> {
        return read(nextPage(continuation), true);
    }

    /**
     * Searches the same words again with a scope the server offered, or across every source.
     */
    function searchWithin(source: PaletteSourceData | null): void {
        within.value = source;
        searchSoon();
    }

    function reset(): void {
        cancel();
        currentSources += 1;
        words.value = '';
        within.value = null;
        answer.value = null;
        hits.value = [];
        added.value = 0;
        failed.value = false;
    }

    /**
     * Drops what the palette shows when the protected view is purged, and searches the same words again.
     */
    function reload(): void {
        sources.value = [];
        answer.value = null;
        hits.value = [];
        added.value = 0;

        if (words.value.trim().length >= MINIMUM_CHARACTERS) {
            searchSoon();
        }
    }

    onBeforeUnmount(onPurge(reload));

    return {
        words,
        within,
        answer,
        hits,
        added,
        sources,
        loading,
        failed,
        readSources,
        searchSoon,
        continueSearch,
        searchWithin,
        cancel,
        reset,
    };
}
