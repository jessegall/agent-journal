<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, nextTick, ref, useId, useTemplateRef, watch } from 'vue';
import Dialog from '@/components/kit/Dialog.vue';
import ListBox from '@/components/kit/ListBox.vue';
import MenuGroup from '@/components/kit/MenuGroup.vue';
import MenuItem from '@/components/kit/MenuItem.vue';
import SearchField from '@/components/kit/SearchField.vue';
import { useAppearance } from '@/composables/useAppearance';
import { useShellOverlays } from '@/composables/useShellOverlays';
import { useSidebar } from '@/composables/useSidebar';
import type { NavigationData, NavigationItemData } from '@/types/generated';

/**
 * The command palette, a modal dialog: a search field that keeps the focus above a list of the shell's commands and the
 * pages of the navigation the server merged for this user, in groups. Typing filters them; Up, Down and Enter move and
 * choose, and do nothing while nothing matches, which says so. The active option is named by aria-activedescendant and
 * kept in view. Enter goes to the chosen page or runs the chosen command; Escape closes it and gives the focus back.
 */
type Entry = { id: string; group: 'Commands' | 'Pages'; label: string; run: () => void };

const { isPaletteOpen, isHelpOpen } = useShellOverlays();
const page = usePage<{ navigation: NavigationData }>();
const { toggle: toggleSidebar } = useSidebar();
const { update } = useAppearance();

const query = ref('');
const activeId = ref<string | null>(null);
const list = useTemplateRef<InstanceType<typeof ListBox>>('list');
const root = useTemplateRef<HTMLElement>('root');
const listId = `palette-${useId()}`;

const commands = computed<Entry[]>(() => [
    { id: 'sidebar', group: 'Commands', label: 'Show or hide the sidebar', run: toggleSidebar },
    { id: 'help', group: 'Commands', label: 'Open keyboard help', run: () => (isHelpOpen.value = true) },
    { id: 'light', group: 'Commands', label: 'Use the light color scheme', run: () => update('light') },
    { id: 'dark', group: 'Commands', label: 'Use the dark color scheme', run: () => update('dark') },
    { id: 'system', group: 'Commands', label: 'Follow the system color scheme', run: () => update('system') },
]);

function flatten(items: NavigationItemData[]): NavigationItemData[] {
    return items.flatMap((item) => [item, ...flatten(item.children)]);
}

const pages = computed<Entry[]>(() =>
    flatten(page.props.navigation?.items ?? []).flatMap((item) =>
        item.url === undefined
            ? []
            : [{ id: `page-${item.key}`, group: 'Pages' as const, label: item.label, run: () => router.visit(item.url as string) }],
    ),
);

const shown = computed(() => {
    const wanted = query.value.trim().toLowerCase();

    return [...commands.value, ...pages.value].filter((entry) => entry.label.toLowerCase().includes(wanted));
});
const groups = computed(() =>
    (['Commands', 'Pages'] as const)
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

watch(isPaletteOpen, async (isOpen) => {
    if (!isOpen) {
        return;
    }

    query.value = '';
    await nextTick();
    await nextTick();
    root.value?.querySelector<HTMLElement>('input')?.focus();
});
</script>

<template>
    <Dialog :open="isPaletteOpen" title="Command palette" size="md" placement="top-64" @close="isPaletteOpen = false">
        <div ref="root" class="flex max-h-[60dvh] flex-col">
            <SearchField
                v-model="query"
                label="Search commands"
                placeholder="Type a command or a page"
                :controls="listId"
                :active-descendant="activeId ?? undefined"
                @move="press($event === 1 ? 'ArrowDown' : 'ArrowUp')"
                @run="press('Enter')"
                @close="isPaletteOpen = false"
            />
            <div :id="listId" class="min-h-0 flex-1 overflow-y-auto">
                <ListBox ref="list" v-model:active-id="activeId" label="Commands and pages" size="palette">
                    <template v-for="group in groups" :key="group.title">
                        <MenuGroup :label="group.title">
                            <template v-for="entry in group.entries" :key="entry.id">
                                <MenuItem option :id="idOf(entry)" @click="choose(entry)">{{
                                    entry.label
                                }}</MenuItem>
                            </template>
                        </MenuGroup>
                    </template>
                </ListBox>
                <template v-if="shown.length === 0">
                    <p role="status" class="px-3 py-2 text-small text-text-3">No matching commands</p>
                </template>
            </div>
        </div>
    </Dialog>
</template>
