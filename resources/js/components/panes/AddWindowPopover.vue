<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef, watch } from 'vue';
import Icon from '@/components/kit/Icon.vue';
import ListBox from '@/components/kit/ListBox.vue';
import MenuItem from '@/components/kit/MenuItem.vue';
import Popover from '@/components/kit/Popover.vue';
import SearchField from '@/components/kit/SearchField.vue';
import type { PaneWindow } from './paneLayout';

/**
 * The offer of every window, in a Popover under the add button: a search field that keeps the focus above a list of
 * them, named by aria-controls and aria-activedescendant, the active one kept in view. Typing filters by title; Up,
 * Down and Enter do nothing while no window matches, which says so. A window already open is marked open, and choosing
 * it brings it forward. Enter or a click adds a closed window, a press on one can instead start dragging it to a place,
 * and Escape closes it with the focus back on the button. The hint under the list says what adding does here.
 */
const props = defineProps<{ windows: PaneWindow[]; shownKeys: string[]; anchor: HTMLElement | null; hint: string }>();
const open = defineModel<boolean>('open', { default: false });
const emit = defineEmits<{ add: [key: string]; show: [key: string]; grab: [event: PointerEvent, key: string] }>();

const query = ref('');
const activeId = ref<string | null>(null);
const list = useTemplateRef<InstanceType<typeof ListBox>>('list');
const root = useTemplateRef<HTMLElement>('root');
const listId = `add-window-${useId()}`;

const matches = computed(() => {
    const wanted = query.value.trim().toLowerCase();

    return props.windows.filter((window) => window.title.toLowerCase().includes(wanted));
});

function idOf(key: string): string {
    return `${listId}-${key}`;
}

function press(key: string): void {
    list.value?.controlKeys(new KeyboardEvent('keydown', { key, cancelable: true }));
}

function close(): void {
    open.value = false;
    props.anchor?.focus();
}

function isShown(key: string): boolean {
    return props.shownKeys.includes(key);
}

/**
 * An open window comes forward on any click; a closed one is added here only from the keyboard, since a pointer press
 * on it starts a grab that adds it on release.
 */
function choose(event: MouseEvent, key: string): void {
    if (isShown(key)) {
        emit('show', key);
        open.value = false;

        return;
    }

    if (event.detail === 0) {
        emit('add', key);
        open.value = false;
    }
}

function grab(event: PointerEvent, key: string): void {
    if (!isShown(key)) {
        emit('grab', event, key);
    }
}

watch(open, async (isOpen) => {
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
    <Popover v-model:open="open" label="Add a window" :anchor="anchor" align="right" :width="320">
        <div ref="root" class="flex max-h-[min(80vh,420px)] w-full flex-col max-[760px]:max-w-[calc(100vw-12px)]">
            <SearchField
                v-model="query"
                label="Search windows"
                placeholder="Add a window…"
                :controls="listId"
                :active-descendant="activeId ?? undefined"
                @move="press($event === 1 ? 'ArrowDown' : 'ArrowUp')"
                @run="press('Enter')"
                @close="close"
            />
            <div :id="listId" class="min-h-0 flex-1 overflow-y-auto">
                <ListBox ref="list" v-model:active-id="activeId" label="Windows to add">
                    <template v-for="window in matches" :key="window.key">
                        <MenuItem
                            option
                            :id="idOf(window.key)"
                            @pointerdown="grab($event, window.key)"
                            @click="choose($event, window.key)"
                        >
                            <template #leading><Icon :name="window.icon" :size="14" /></template>
                            {{ window.title }}
                            <template v-if="isShown(window.key)" #trailing>
                                <span class="text-badge text-text-3">open</span>
                            </template>
                        </MenuItem>
                    </template>
                </ListBox>
                <template v-if="matches.length === 0">
                    <p role="status" class="px-3 py-2 text-small text-text-3">
                        No window matches
                    </p>
                </template>
            </div>
            <p class="border-t border-line px-3 py-2 text-badge text-text-3">
                {{ hint }}
            </p>
        </div>
    </Popover>
</template>
