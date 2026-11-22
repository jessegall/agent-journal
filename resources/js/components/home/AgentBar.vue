<script setup lang="ts">
import { computed, ref } from 'vue';
import AddWindowPopover from '@/components/panes/AddWindowPopover.vue';
import LayoutPicker from '@/components/panes/LayoutPicker.vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import { moveWindow, panesIn } from '@/components/panes/paneLayout';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import type { LayoutData } from '@/types/generated';

/**
 * The agent bar, 54 px under decision D3: the sections the domains put in Home's bar, such as the conversation trigger,
 * the chosen agent with its live state, its members and Stop (which asks first), then at the right the layouts menu,
 * Add a window and Hide. Every control has a name that shows on hover and focus. Hide takes the bar's sections away and
 * leaves a button that brings them back, so the desk keeps the room.
 */
defineProps<{ layouts: LayoutData[] }>();

const store = usePaneLayout();
const isHidden = ref(false);
const isLayoutMenuOpen = ref(false);
const isAdding = ref(false);
const addButton = ref<{ $el: HTMLElement } | null>(null);
const addAnchor = computed(() => addButton.value?.$el ?? null);

function add(key: string): void {
    const first = panesIn(store.layout.value)[0];

    if (first !== undefined) {
        store.change(moveWindow(store.layout.value, key, first.id));
    }
}
</script>

<template>
    <div
        class="relative flex min-h-[54px] flex-none items-center gap-2.5 border-b border-border px-4 text-body max-[760px]:flex-wrap max-[760px]:py-2"
        role="region"
        aria-label="Agent"
    >
        <template v-if="!isHidden">
            <slot />
        </template>
        <span class="flex-1"></span>
        <Button
            variant="icon"
            aria-label="Layouts"
            title="Layouts"
            aria-haspopup="menu"
            :aria-expanded="isLayoutMenuOpen"
            @click="isLayoutMenuOpen = !isLayoutMenuOpen"
            ><Icon name="layout" :size="13"
        /></Button>
        <Button
            ref="addButton"
            variant="icon"
            aria-label="Add a window"
            title="Add a window"
            :aria-expanded="isAdding"
            @click="isAdding = !isAdding"
            ><Icon name="plus" :size="13"
        /></Button>
        <Button
            variant="icon"
            :aria-label="isHidden ? 'Show the agent bar' : 'Hide the agent bar'"
            :title="isHidden ? 'Show the agent bar' : 'Hide the agent bar'"
            :pressed="isHidden"
            @click="isHidden = !isHidden"
            ><Icon name="minimize" :size="13"
        /></Button>
        <template v-if="isLayoutMenuOpen">
            <LayoutPicker
                :layouts="layouts"
                class="absolute top-[50px] right-[5px]"
                @done="isLayoutMenuOpen = false"
            />
        </template>
        <AddWindowPopover
            v-model:open="isAdding"
            :windows="store.closedWindows.value"
            :anchor="addAnchor"
            @add="add"
            @grab="(_event, key) => add(key)"
        />
    </div>
</template>
