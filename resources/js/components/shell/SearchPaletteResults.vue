<script setup lang="ts">
import { computed, ref, useId, useTemplateRef } from 'vue';
import Button from '@/components/kit/Button.vue';
import ListBox from '@/components/kit/ListBox.vue';
import MenuItem from '@/components/kit/MenuItem.vue';
import type { PaletteHitData } from '@/types/generated';
import type { useSearchPalette } from './useSearchPalette';

/**
 * The search palette's results: the direct open of a complete reference first, labelled such as Open Task 2241, then
 * the hits in the server's order, each named by its title and its section or line; arrows and Enter move and open
 * from the words field. The matched words are marked in plain text. More hits are appended and their count announced
 * without moving the selection. Each end of a search says what it is: no matches with Search all inside one source,
 * no sources, a failed read that keeps the words and the hits with Retry, an incomplete search with narrower scopes,
 * an expired search, a scope to choose, and a hit that is gone.
 */
const props = defineProps<{ search: ReturnType<typeof useSearchPalette>; unavailable: boolean }>();
const emit = defineEmits<{ open: [hit: PaletteHitData] }>();

const activeId = ref<string | null>(null);
const list = useTemplateRef<InstanceType<typeof ListBox>>('list');
const listId = `search-results-${useId()}`;

const answer = computed(() => props.search.answer.value);
const direct = computed(() => answer.value?.directOpen ?? null);
const status = computed(() => answer.value?.status ?? null);
const announced = computed(() =>
    props.search.added.value > 0 ? `${props.search.added.value} more results, ${props.search.hits.value.length} in all` : '',
);

function nameOf(hit: PaletteHitData): string {
    return hit.locationLabel === null ? hit.title : `${hit.title}, ${hit.locationLabel}`;
}

/**
 * The excerpt cut around the words without regard to case, so the matched part is marked as text, never as markup.
 */
function partsOf(text: string): { text: string; matched: boolean }[] {
    const words = props.search.words.value.trim();
    const at = words === '' ? -1 : text.toLowerCase().indexOf(words.toLowerCase());

    if (at < 0) {
        return [{ text, matched: false }];
    }

    return [
        { text: text.slice(0, at), matched: false },
        { text: text.slice(at, at + words.length), matched: true },
        { text: text.slice(at + words.length), matched: false },
    ].filter((part) => part.text !== '');
}

function press(key: string): void {
    list.value?.controlKeys(new KeyboardEvent('keydown', { key, cancelable: true }));
}

defineExpose({ press, listId, activeId });
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col">
        <p role="status" aria-live="polite" class="sr-only">{{ announced }}</p>
        <template v-if="unavailable">
            <p role="alert" class="px-3 py-2 text-small text-text-2">That item is no longer available.</p>
        </template>
        <div :id="listId" class="min-h-0 flex-1 overflow-y-auto">
            <ListBox ref="list" v-model:active-id="activeId" label="Search results" size="palette">
                <template v-if="direct !== null">
                    <MenuItem option :id="`${listId}-direct`" @click="emit('open', direct)">{{
                        answer?.directOpenLabel
                    }}</MenuItem>
                </template>
                <template v-for="hit in search.hits.value" :key="`${hit.sourceKey}-${hit.recordId}-${hit.locationLabel}`">
                    <MenuItem
                        option
                        :id="`${listId}-${hit.sourceKey}-${hit.recordId}-${hit.locationLabel ?? ''}`"
                        :aria-label="nameOf(hit)"
                        @click="emit('open', hit)"
                    >
                        <span class="flex min-w-0 flex-col">
                            <span class="truncate text-body text-text">{{ nameOf(hit) }}</span>
                            <span class="truncate text-small text-text-3"
                                ><span>{{ hit.sourceLabel }} · </span
                                ><template v-for="(part, index) in partsOf(hit.snippet)" :key="index"
                                    ><template v-if="part.matched"
                                        ><mark class="bg-transparent font-medium text-text-2">{{ part.text }}</mark></template
                                    ><template v-else
                                        ><span>{{ part.text }}</span></template
                                    ></template
                                ></span
                            >
                        </span>
                    </MenuItem>
                </template>
            </ListBox>
        </div>
        <div class="flex flex-wrap items-center gap-2 px-3 py-2 text-small text-text-3">
            <template v-if="search.failed.value">
                <span role="alert">The search could not be completed.</span>
                <Button variant="bordered" size="small" @click="search.searchSoon()">Retry</Button>
            </template>
            <template v-else-if="search.loading.value">
                <span role="status">Searching</span>
            </template>
            <template v-else-if="status === 'complete' && search.hits.value.length === 0 && search.within.value !== null">
                <span role="status">No matches in {{ search.within.value.label }}</span>
                <Button variant="bordered" size="small" @click="search.searchWithin(null)">Search all</Button>
            </template>
            <template v-else-if="status === 'complete' && search.hits.value.length === 0">
                <span role="status">No matches</span>
            </template>
            <template v-else-if="status === 'no_sources'">
                <span role="status">No sources are available to search.</span>
            </template>
            <template v-else-if="status === 'restart'">
                <span role="status">This search expired.</span>
                <Button variant="bordered" size="small" @click="search.searchSoon()">Search again</Button>
            </template>
            <template v-else-if="status === 'unknown_scope' || status === 'ambiguous_scope'">
                <span role="status">Choose a source:</span>
                <template v-for="source in answer?.alternatives ?? []" :key="source.key">
                    <Button variant="bordered" size="small" @click="search.searchWithin(source)">{{
                        source.display
                    }}</Button>
                </template>
            </template>
            <template v-else-if="status === 'incomplete'">
                <span role="status">{{ answer?.reason }}</span>
                <template v-for="key in answer?.narrowerScopes ?? []" :key="key">
                    <Button
                        variant="bordered"
                        size="small"
                        @click="search.searchWithin({ key, label: key, display: key })"
                        >Search {{ key }}</Button
                    >
                </template>
            </template>
            <template v-else-if="answer?.continuation && (status === 'more' || status === 'retryable')">
                <Button variant="bordered" size="small" @click="search.continueSearch(answer.continuation)">{{
                    status === 'retryable' ? 'Retry' : 'Show more'
                }}</Button>
            </template>
        </div>
    </div>
</template>
