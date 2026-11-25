<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, nextTick, ref, useId, useTemplateRef, watch } from 'vue';
import Dialog from '@/components/kit/Dialog.vue';
import Icon from '@/components/kit/Icon.vue';
import type { IconName } from '@/components/kit/Icon.vue';
import ListBox from '@/components/kit/ListBox.vue';
import MenuGroup from '@/components/kit/MenuGroup.vue';
import MenuItem from '@/components/kit/MenuItem.vue';
import SearchField from '@/components/kit/SearchField.vue';
import { useAppearance } from '@/composables/useAppearance';
import { useShellOverlays } from '@/composables/useShellOverlays';
import { useSidebar } from '@/composables/useSidebar';
import { useAppContext } from '@/framework/appContext';
import type { NavigationItemData, PaletteHitData } from '@/types/generated';
import { MINIMUM_CHARACTERS, useSearchPalette } from './useSearchPalette';

/**
 * The command palette, a modal dialog: a search field that keeps the focus above a list of the shell's commands and the
 * pages of the navigation the server merged for this user, in groups. Typing filters them, and from two characters on
 * the records the common search finds for the words follow them; Up, Down and Enter move and choose, and do nothing
 * while nothing matches, which says so. The active option is named by aria-activedescendant and
 * kept in view. Enter goes to the chosen page or runs the chosen command; Escape closes it and gives the focus back.
 */
type Entry = { id: string; group: 'Commands' | 'Pages' | 'Records'; label: string; icon: IconName; run: () => void };

const { isPaletteOpen, isHelpOpen } = useShellOverlays();
const { navigation } = useAppContext();
const { toggle: toggleSidebar } = useSidebar();
const { update } = useAppearance();

const query = ref('');
const search = useSearchPalette();
const activeId = ref<string | null>(null);
const list = useTemplateRef<InstanceType<typeof ListBox>>('list');
const root = useTemplateRef<HTMLElement>('root');
const listId = `palette-${useId()}`;

const commands = computed<Entry[]>(() => [
    { id: 'sidebar', group: 'Commands', label: 'Show or hide the sidebar', icon: 'list', run: toggleSidebar },
    { id: 'help', group: 'Commands', label: 'Open keyboard help', icon: 'question', run: () => (isHelpOpen.value = true) },
    { id: 'light', group: 'Commands', label: 'Use the light color scheme', icon: 'scheme', run: () => update('light') },
    { id: 'dark', group: 'Commands', label: 'Use the dark color scheme', icon: 'scheme', run: () => update('dark') },
    { id: 'system', group: 'Commands', label: 'Follow the system color scheme', icon: 'scheme', run: () => update('system') },
]);

function flatten(items: NavigationItemData[]): NavigationItemData[] {
    return items.flatMap((item) => [item, ...flatten(item.children)]);
}

const pages = computed<Entry[]>(() =>
    flatten(navigation.value?.items ?? []).flatMap((item) => {
        const url = item.url;

        if (url === undefined) {
            return [];
        }

        return [
            {
                id: `page-${item.key}`,
                group: item.isInSidebar ? ('Pages' as const) : ('Commands' as const),
                label: item.isInSidebar ? item.label : `Open ${item.label}`,
                icon: item.isInSidebar || item.icon === undefined ? ('arrow' as const) : item.icon,
                run: () => router.visit(url),
            },
        ];
    }),
);

// The records the search found for the words, each opening its own page; a hit with no page of its own is left out.
const records = computed<Entry[]>(() =>
    query.value.trim().length < MINIMUM_CHARACTERS
        ? []
        : search.hits.value.flatMap((hit: PaletteHitData) =>
              hit.href === null
                  ? []
                  : [
                        {
                            id: `record-${hit.sourceKey}-${hit.recordId}`,
                            group: 'Records' as const,
                            label: hit.title,
                            icon: 'arrow' as const,
                            run: () => router.visit(hit.href as string),
                        },
                    ],
          ),
);

const shown = computed(() => {
    const wanted = query.value.trim().toLowerCase();

    return [
        ...[...commands.value, ...pages.value].filter((entry) => entry.label.toLowerCase().includes(wanted)),
        ...records.value,
    ];
});
const groups = computed(() =>
    (['Commands', 'Pages', 'Records'] as const)
        .map((title) => ({ title, entries: shown.value.filter((entry) => entry.group === title) }))
        .filter((group) => group.entries.length > 0),
);

function idOf(entry: Entry): string {
    return `${listId}-${entry.id}`;
}

function press(key: string): void {
    list.value?.controlKeys(new KeyboardEvent('keydown', { key, cancelable: true }));
}

function choose(entry: Entry): void {
    isPaletteOpen.value = false;
    entry.run();
}

watch(query, (words) => {
    search.words.value = words;

    if (words.trim().length < MINIMUM_CHARACTERS) {
        search.reset();

        return;
    }

    search.searchSoon();
});

watch(isPaletteOpen, async (isOpen) => {
    if (!isOpen) {
        search.reset();

        return;
    }

    query.value = '';
    await nextTick();
    await nextTick();
    root.value?.querySelector<HTMLElement>('input')?.focus();
});
</script>

<template>
    <Dialog
        :open="isPaletteOpen"
        title="Command palette"
        size="md"
        placement="top-64"
        :header="false"
        flush
        @close="isPaletteOpen = false"
    >
        <div ref="root" class="flex max-h-[60dvh] flex-col">
            <SearchField
                v-model="query"
                label="Search commands, pages and records"
                placeholder="Type a command, a page, a task, a document or a file"
                :controls="listId"
                :active-descendant="activeId ?? undefined"
                @move="press($event === 1 ? 'ArrowDown' : 'ArrowUp')"
                @run="press('Enter')"
                @close="isPaletteOpen = false"
            />
            <div :id="listId" class="min-h-0 flex-1 overflow-y-auto p-1.5">
                <ListBox ref="list" v-model:active-id="activeId" label="Commands, pages and records" size="palette">
                    <template v-for="group in groups" :key="group.title">
                        <MenuGroup :label="group.title">
                            <template v-for="entry in group.entries" :key="entry.id">
                                <MenuItem option :id="idOf(entry)" @click="choose(entry)">
                                    <template #leading><Icon :name="entry.icon" :size="14" /></template>
                                    {{ entry.label }}
                                </MenuItem>
                            </template>
                        </MenuGroup>
                    </template>
                </ListBox>
                <template v-if="shown.length === 0 && !search.loading.value">
                    <p role="status" class="px-3 py-2 text-small text-text-3">Nothing matches</p>
                </template>
            </div>
            <p class="border-t border-line px-3 py-2 text-badge text-text-3">↑ ↓ choose · Enter runs it · Esc closes</p>
        </div>
    </Dialog>
</template>
