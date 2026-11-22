<script setup lang="ts">
import { nextTick, onUpdated, useId, useTemplateRef } from 'vue';
import { useDropdown } from '@/composables/useDropdown';
import { useMenuKeys } from '@/composables/useMenuKeys';
import Icon from './Icon.vue';

/**
 * A button that opens a labelled menu of MenuItems, MenuGroups and MenuSeparators. Enter, Space or Down opens it on
 * its first enabled item and Up on its last; Down and Up then move and wrap, Home and End jump, and typing letters
 * moves to the item that starts with them. Enter and Space run an item, Escape closes the menu and gives the focus back
 * to the button, Tab closes it and moves on, and choosing an item closes it. The items stay mounted, so a form keeps its
 * state. The button holds a three-dot icon unless the trigger slot fills it. When the item in focus goes, the first
 * item left takes the focus; when none is left, the menu closes and the button takes it. The menu enters over 180ms with
 * a 4px rise, and without motion under reduced motion.
 */
withDefaults(defineProps<{ label: string; align?: 'left' | 'right'; triggerClass?: string; disabled?: boolean }>(), {
    align: 'right',
    disabled: false,
    triggerClass:
        'size-7 justify-center rounded-button text-text-3 hover:bg-hover hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text',
});

const { isOpen, toggle, close } = useDropdown('root');
const trigger = useTemplateRef<HTMLButtonElement>('trigger');
const panel = useTemplateRef<HTMLElement>('panel');
const panelId = useId();
const { items, focusAt, onKeydown } = useMenuKeys(panel);

async function openAt(position: 'first' | 'last'): Promise<void> {
    if (!isOpen.value) {
        toggle();
    }

    await nextTick();
    focusAt(position);
}

function toggleFromButton(): void {
    if (isOpen.value) {
        close();

        return;
    }

    void openAt('first');
}

function closeToButton(): void {
    close();
    trigger.value?.focus();
}

function closeAfterChoice(event: MouseEvent): void {
    const item = (event.target as Element).closest('[role^="menuitem"]');

    if (item === null || item.getAttribute('aria-disabled') === 'true') {
        return;
    }

    closeToButton();
}

function closeWhenFocusLeaves(event: FocusEvent): void {
    if ((event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
        return;
    }

    close();
}

onUpdated(() => {
    if (!isOpen.value) {
        return;
    }

    if (items().length === 0) {
        closeToButton();

        return;
    }

    if (!panel.value?.contains(document.activeElement)) {
        focusAt('first');
    }
});

defineExpose({ open: () => openAt('first') });
</script>

<template>
    <div ref="root" class="relative" @focusout="closeWhenFocusLeaves">
        <button
            ref="trigger"
            type="button"
            aria-haspopup="menu"
            :aria-expanded="isOpen"
            :aria-controls="panelId"
            :aria-label="label"
            :title="label"
            :disabled="disabled"
            class="inline-flex items-center transition-colors duration-(--duration-hover) motion-reduce:transition-none disabled:cursor-default disabled:opacity-45"
            :class="triggerClass"
            @click="toggleFromButton"
            @keydown.down.prevent="openAt('first')"
            @keydown.up.prevent="openAt('last')"
        >
            <slot name="trigger">
                <Icon name="dots-vertical" />
            </slot>
        </button>
        <Transition
            enter-active-class="transition duration-(--duration-pop) ease-journal motion-reduce:transition-none"
            enter-from-class="translate-y-1 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
        >
            <div
                v-show="isOpen"
                :id="panelId"
                ref="panel"
                role="menu"
                :aria-label="label"
                class="absolute top-full z-(--z-menu) mt-1 flex max-w-82.5 min-w-55 flex-col rounded-menu border border-border-2 bg-raised p-1.5 shadow-(--shadow-pop)"
                :class="align === 'right' ? 'right-0' : 'left-0'"
                @keydown="onKeydown"
                @keydown.tab="close"
                @keydown.escape.stop="closeToButton"
                @click="closeAfterChoice"
            >
                <slot />
            </div>
        </Transition>
    </div>
</template>
