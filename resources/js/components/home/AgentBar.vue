<script setup lang="ts">
import { computed, ref } from 'vue';
import AddWindowPopover from '@/components/panes/AddWindowPopover.vue';
import LayoutPicker from '@/components/panes/LayoutPicker.vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import { floatNewWindow, showWindow } from '@/components/panes/arrangement';
import type { DeskEdges } from '@/components/panes/arrangement';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import { useWindowDrag } from '@/components/panes/useWindowDrag';
import type { LayoutData } from '@/types/generated';

/**
 * The agent bar, 54 px under decision D3: the sections the domains put in Home's bar, such as the conversation trigger,
 * the chosen agent with its live state, its members and Stop (which asks first), then at the right the layouts menu,
 * Add a window and Hide. Every control has a name that shows on hover and focus. Hide takes the bar's sections away and
 * leaves a button that brings them back, so the desk keeps the room.
 */
defineProps<{ layouts: LayoutData[] }>();

const store = usePaneLayout();
const { grab } = useWindowDrag();
const isHidden = ref(false);
const isLayoutMenuOpen = ref(false);
const isAdding = ref(false);
const addButton = ref<{ $el: HTMLElement } | null>(null);
const agentBar = ref<HTMLElement | null>(null);
const addAnchor = computed(() => addButton.value?.$el ?? null);

/** The information bar's height: it shows under this bar as soon as a window floats. */
const INFORMATION_BAR_HEIGHT = 30;

/**
 * A window added from the bar floats where it opened; it docks once it is dragged to an edge or onto a pane.
 */
function add(key: string): void {
    isAdding.value = false;
    store.apply(
        floatNewWindow(
            store.arrangement.value,
            key,
            store.screen(),
            deskEdges(),
        ),
    );
}

/**
 * Where the desk below the bars starts and ends on screen, so a new floating window opens inside it.
 */
function deskEdges(): DeskEdges {
    const bar = agentBar.value?.getBoundingClientRect();

    return {
        top: (bar?.bottom ?? 0) + INFORMATION_BAR_HEIGHT,
        right: window.innerWidth,
    };
}
</script>

<template>
    <div
        ref="agentBar"
        class="flex min-h-[54px] flex-none items-center gap-2 border-b border-border px-3 text-body max-[760px]:flex-wrap max-[760px]:py-2"
        role="region"
        aria-label="Agent"
    >
        <div class="flex min-w-0 flex-1 items-center gap-2.5">
            <template v-if="!isHidden">
                <slot />
            </template>
        </div>
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
            :windows="store.windows.value"
            :shown-keys="store.shownKeys.value"
            :anchor="addAnchor"
            hint="Enter opens it floating · drag a row onto Home to dock it"
            @add="add"
            @show="(key) => store.apply(showWindow(store.arrangement.value, key))"
            @grab="
                (event, key) => {
                    isAdding = false;
                    grab(event, key, null, () => add(key));
                }
            "
        />
    </div>
</template>
