<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, nextTick, ref, useId, useTemplateRef, watch } from 'vue';
import Button from '@/components/kit/Button.vue';
import Dialog from '@/components/kit/Dialog.vue';
import ListBox from '@/components/kit/ListBox.vue';
import MenuGroup from '@/components/kit/MenuGroup.vue';
import MenuItem from '@/components/kit/MenuItem.vue';
import SearchField from '@/components/kit/SearchField.vue';
import { useShellOverlays } from '@/composables/useShellOverlays';
import type { PaletteHitData, PaletteSourceData } from '@/types/generated';
import SearchPaletteResults from './SearchPaletteResults.vue';
import { MINIMUM_CHARACTERS, useSearchPalette } from './useSearchPalette';

/**
 * The search palette, a modal dialog over the common search service: the words field keeps the focus; before two
 * characters it shows the minimum and the inline hints, and the scope picker next to it (Tab to reach it, type or
 * arrow to a source, Enter to choose it, All sources to clear) reads the sources the reader may search without a
 * record query. Words are searched 200 ms after the last keystroke; a newer read supersedes an older one and an
 * answer that comes late, or after the palette closed, is dropped. Closing gives the focus, and the selection of a
 * field it came from, back to where it was.
 */
const { isSearchOpen } = useShellOverlays();
const search = useSearchPalette();
const pickingScope = ref(false);
const scopeFilter = ref('');
const activeScope = ref<string | null>(null);
const root = useTemplateRef<HTMLElement>('root');
const scopeList = useTemplateRef<InstanceType<typeof ListBox>>('scopeList');
const scopeListId = `search-scope-${useId()}`;
const results = useTemplateRef<InstanceType<typeof SearchPaletteResults>>('results');
const unavailable = ref(false);
let opener: { element: HTMLElement; start: number | null; end: number | null } | null = null;

const tooShort = computed(() => search.words.value.trim().length < MINIMUM_CHARACTERS);
const scopeLabel = computed(() => (search.within.value === null ? 'All sources' : search.within.value.display));

function remember(): void {
    const element = document.activeElement;

    if (!(element instanceof HTMLElement)) {
        opener = null;

        return;
    }

    const field = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element : null;
    opener = { element, start: field?.selectionStart ?? null, end: field?.selectionEnd ?? null };
}

async function restore(): Promise<void> {
    const saved = opener;
    opener = null;
    await nextTick();

    if (saved === null) {
        return;
    }

    saved.element.focus();

    if (
        (saved.element instanceof HTMLInputElement || saved.element instanceof HTMLTextAreaElement) &&
        saved.start !== null &&
        saved.end !== null
    ) {
        saved.element.setSelectionRange(saved.start, saved.end);
    }
}

function close(): void {
    isSearchOpen.value = false;
}

function chooseScope(source: PaletteSourceData | null): void {
    search.within.value = source;
    pickingScope.value = false;
    root.value?.querySelector<HTMLElement>('input')?.focus();
    search.searchSoon();
}

function pressScope(key: string): void {
    scopeList.value?.controlKeys(new KeyboardEvent('keydown', { key, cancelable: true }));
}

/**
 * Opens a hit's page; a hit whose record is gone says so and leaves the palette on the same search.
 */
function open(hit: PaletteHitData): void {
    if (hit.href === null) {
        return;
    }

    router.visit(hit.href, {
        onSuccess: () => close(),
        onHttpException: () => {
            unavailable.value = true;

            return false;
        },
    });
}

/**
 * Enter in the words field opens the active result, or the direct open when none is active yet, so a complete
 * reference opens with one Enter.
 */
function run(): void {
    const direct = search.answer.value?.directOpen ?? null;

    if (results.value?.activeId === null && direct !== null) {
        open(direct);

        return;
    }

    results.value?.press('Enter');
}

watch(search.words, () => {
    unavailable.value = false;
    search.searchSoon();
});
watch(scopeFilter, (prefix) => void search.readSources(prefix.trim()));

watch(isSearchOpen, async (isOpen) => {
    if (!isOpen) {
        search.reset();
        pickingScope.value = false;
        await restore();

        return;
    }

    remember();
    unavailable.value = false;
    search.reset();
    scopeFilter.value = '';
    void search.readSources('');
    await nextTick();
    await nextTick();
    root.value?.querySelector<HTMLElement>('input')?.focus();
});
</script>

<template>
    <Dialog
        :open="isSearchOpen"
        title="Search"
        size="lg"
        placement="top-64"
        @close="close"
    >
        <div ref="root" class="flex max-h-[70dvh] flex-col">
            <div class="flex items-center gap-2">
                <div class="min-w-0 flex-1">
                    <SearchField
                        v-model="search.words.value"
                        label="Search"
                        placeholder="Type at least two characters"
                        :controls="results?.listId"
                        :active-descendant="results?.activeId ?? undefined"
                        @move="results?.press($event === 1 ? 'ArrowDown' : 'ArrowUp')"
                        @run="run"
                        @close="close"
                    />
                </div>
                <Button
                    variant="bordered"
                    size="small"
                    :aria-expanded="pickingScope"
                    :aria-controls="scopeListId"
                    @click="pickingScope = !pickingScope"
                    >{{ scopeLabel }}</Button
                >
            </div>
            <template v-if="pickingScope">
                <SearchField
                    v-model="scopeFilter"
                    label="Choose a source"
                    placeholder="Type a source's name"
                    :controls="scopeListId"
                    :active-descendant="activeScope ?? undefined"
                    @move="pressScope($event === 1 ? 'ArrowDown' : 'ArrowUp')"
                    @run="pressScope('Enter')"
                    @close="pickingScope = false"
                />
                <div :id="scopeListId" class="max-h-48 overflow-y-auto">
                    <ListBox ref="scopeList" v-model:active-id="activeScope" label="Sources" size="palette">
                        <MenuGroup label="Sources">
                            <MenuItem option :id="`${scopeListId}-all`" @click="chooseScope(null)">All sources</MenuItem>
                            <template v-for="source in search.sources.value" :key="source.key">
                                <MenuItem option :id="`${scopeListId}-${source.key}`" @click="chooseScope(source)">{{
                                    source.display
                                }}</MenuItem>
                            </template>
                        </MenuGroup>
                    </ListBox>
                </div>
            </template>
            <template v-if="tooShort">
                <p role="status" class="px-3 py-2 text-small text-text-3">
                    Type at least {{ MINIMUM_CHARACTERS }} characters to search.
                    <template v-for="hint in search.answer.value?.hints ?? []" :key="hint">
                        <span class="ml-1 text-text-2">{{ hint }}</span>
                    </template>
                </p>
            </template>
            <template v-else>
                <SearchPaletteResults ref="results" :search="search" :unavailable="unavailable" @open="open" />
            </template>
        </div>
    </Dialog>
</template>
