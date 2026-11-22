<script setup lang="ts">
import { nextTick, onUpdated, useId, useTemplateRef } from 'vue';
import { useDropdown } from '@/composables/useDropdown';
import Icon from './Icon.vue';

/**
 * A button that opens a labelled menu of a record's actions, given as ActionsMenuItem children. Enter or Space opens
 * it on its first item, the arrow keys, Home and End move between the items, and Escape closes it and gives the
 * focus back to the button. Choosing an item closes it too; the items stay mounted, so a form keeps its state. A right
 * click on the menu's host opens the same menu through openFromContext. When the item in focus goes, the first item
 * left takes the focus; when none is left, the menu closes and the button takes it.
 */
defineProps<{ label: string }>();

const { isOpen, toggle, close } = useDropdown('root');
const trigger = useTemplateRef<HTMLButtonElement>('trigger');
const menu = useTemplateRef<HTMLElement>('menu');
const menuId = useId();

function items(): HTMLElement[] {
    const panel = menu.value;

    if (panel === null) {
        return [];
    }

    return Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'));
}

async function openAt(position: 'first' | 'last'): Promise<void> {
    if (!isOpen.value) {
        toggle();
    }

    await nextTick();
    const shown = items();
    shown[position === 'first' ? 0 : shown.length - 1]?.focus();
}

function toggleFromButton(): void {
    if (isOpen.value) {
        close();

        return;
    }

    void openAt('first');
}

function moveFocus(event: KeyboardEvent): void {
    const shown = items();
    const current = shown.indexOf(document.activeElement as HTMLElement);
    const targets: Record<string, number> = {
        ArrowDown: current + 1,
        ArrowUp: current - 1,
        Home: 0,
        End: shown.length - 1,
    };

    if (!(event.key in targets) || shown.length === 0) {
        return;
    }

    event.preventDefault();
    shown[(targets[event.key] + shown.length) % shown.length].focus();
}

function closeToButton(): void {
    close();
    trigger.value?.focus();
}

function closeAfterChoice(event: MouseEvent): void {
    if ((event.target as Element).closest('[role="menuitem"]') === null) {
        return;
    }

    closeToButton();
}

function openFromContext(): void {
    void openAt('first');
}

onUpdated(() => {
    if (!isOpen.value) {
        return;
    }

    const shown = items();

    if (shown.length === 0) {
        closeToButton();

        return;
    }

    if (!menu.value?.contains(document.activeElement)) {
        shown[0].focus();
    }
});

defineExpose({ openFromContext });

function closeWhenFocusLeaves(event: FocusEvent): void {
    if ((event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
        return;
    }

    close();
}
</script>

<template>
    <div ref="root" class="relative" @focusout="closeWhenFocusLeaves">
        <button
            ref="trigger"
            type="button"
            aria-haspopup="menu"
            :aria-expanded="isOpen"
            :aria-controls="menuId"
            :aria-label="label"
            :title="label"
            class="inline-flex size-7 items-center justify-center rounded-button text-text-3 transition-colors duration-(--duration-hover) hover:bg-hover hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
            @click="toggleFromButton"
            @keydown.down.prevent="openAt('first')"
            @keydown.up.prevent="openAt('last')"
        >
            <Icon name="dots-vertical" />
        </button>
        <div
            v-show="isOpen"
            :id="menuId"
            ref="menu"
            role="menu"
            :aria-label="label"
            class="absolute top-full right-0 z-90 mt-1 flex min-w-44 flex-col gap-0.5 rounded-control border border-border-2 bg-raised p-1 shadow-lg"
            @keydown="moveFocus"
            @keydown.escape.stop="closeToButton"
            @click="closeAfterChoice"
        >
            <slot />
        </div>
    </div>
</template>
