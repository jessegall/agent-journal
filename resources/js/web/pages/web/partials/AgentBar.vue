<script setup lang="ts">
import { computed, ref } from 'vue';
import AddWindowPopover from '@/web/pages/web/partials/AddWindowPopover.vue';
import LayoutPicker from '@/web/pages/web/partials/LayoutPicker.vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import { floatNewWindow, showWindow } from '@/components/panes/arrangement';
import type { DeskEdges } from '@/components/panes/arrangement';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import { useWindowDrag } from '@/components/panes/useWindowDrag';
import type { LayoutData } from '@/types/generated';

/**
 * Home's one chat bar, 38 px: the domains' bar sections, such as the open chats with New chat and the view switch,
 * then a thin divider, the layouts menu and Add a window, every control on one centre line and named on hover and
 * focus. The agent itself is named in its chat, above the composer.
 */
defineProps<{ layouts: LayoutData[] }>();

const store = usePaneLayout();
const { grabNewWindow } = useWindowDrag();
const grabbedToAdd = grabNewWindow(add);
const isLayoutMenuOpen = ref(false);
const isAdding = ref(false);
const addButton = ref<{ $el: HTMLElement } | null>(null);
const chatBar = ref<HTMLElement | null>(null);
const addAnchor = computed(() => addButton.value?.$el ?? null);
const layoutButton = ref<{ $el: HTMLElement } | null>(null);
const layoutAnchor = computed(() => layoutButton.value?.$el ?? null);

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
    const bar = chatBar.value?.getBoundingClientRect();

    return {
        top: (bar?.bottom ?? 0) + INFORMATION_BAR_HEIGHT,
        right: window.innerWidth,
    };
}
</script>

<template>
    <div
        ref="chatBar"
        class="flex h-[38px] flex-none items-center gap-1 border-b border-border pr-3 text-body"
        role="region"
        aria-label="Chats"
        data-chat-bar
    >
        <div class="flex h-full min-w-0 flex-1 items-center">
            <slot />
        </div>
        <span class="mx-1 h-4 w-px flex-none bg-border-2" aria-hidden="true" data-bar-divider></span>
        <Button
            ref="layoutButton"
            variant="icon"
            aria-label="Layouts"
            title="Layouts"
            aria-haspopup="dialog"
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
        <LayoutPicker v-model:open="isLayoutMenuOpen" :layouts="layouts" :anchor="layoutAnchor" />
        <AddWindowPopover
            v-model:open="isAdding"
            :windows="store.windows.value"
            :shown-keys="store.shownKeys.value"
            :anchor="addAnchor"
            hint="Enter opens it floating · drag a row onto Home to dock it"
            @add="add"
            @show="(key) => store.apply(showWindow(store.arrangement.value, key))"
            @grab="grabbedToAdd"
        />
    </div>
</template>
