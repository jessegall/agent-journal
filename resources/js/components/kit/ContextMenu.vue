<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import { useCloseOutside } from '@/composables/useCloseOutside';
import { useMenuKeys } from '@/composables/useMenuKeys';

/**
 * A menu at the pointer for the host in the default slot, holding the menu slot's items: a right click, the Menu key or
 * Shift+F10 opens it, but not over selected text or a field. Escape closes it and gives the focus back, Tab closes it
 * and moves on. Measures: docs/designs/kit-components.md.
 */
defineProps<{ label: string }>();

const EDGE_GAP = 6;
const FIELD_SELECTOR = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

const placed = ref<{ x: number; y: number } | null>(null);
const panel = useTemplateRef<HTMLElement>('panel');
const { focusAt, onKeydown } = useMenuKeys(panel);
let opener: HTMLElement | null = null;

function close(): void {
    placed.value = null;
}

function closeToOpener(): void {
    close();
    opener?.focus();
}

async function openAt(x: number, y: number): Promise<void> {
    opener = document.activeElement as HTMLElement | null;
    placed.value = { x, y };
    await nextTick();

    const box = panel.value?.getBoundingClientRect();

    if (box !== undefined) {
        const left = Math.min(x, window.innerWidth - box.width - EDGE_GAP);
        const top = y + box.height > window.innerHeight - EDGE_GAP ? y - box.height : y;

        placed.value = { x: Math.max(EDGE_GAP, left), y: Math.max(EDGE_GAP, top) };
    }

    focusAt('first');
}

function isOverSelectedText(target: Node): boolean {
    const selection = window.getSelection();

    if (selection === null || selection.isCollapsed || selection.rangeCount === 0) {
        return false;
    }

    return selection.getRangeAt(0).intersectsNode(target);
}

function openFromPointer(event: MouseEvent): void {
    const target = event.target as Element;

    if (target.closest(FIELD_SELECTOR) !== null || isOverSelectedText(target)) {
        return;
    }

    event.preventDefault();
    void openAt(event.clientX, event.clientY);
}

function openFromKeyboard(event: KeyboardEvent): void {
    if (event.key !== 'ContextMenu' && !(event.key === 'F10' && event.shiftKey)) {
        return;
    }

    const target = event.target as Element;

    if (target.closest(FIELD_SELECTOR) !== null) {
        return;
    }

    const box = target.getBoundingClientRect();

    event.preventDefault();
    void openAt(box.left, box.bottom);
}

function closeAfterChoice(event: MouseEvent): void {
    const item = (event.target as Element).closest('[role^="menuitem"]');

    if (item === null || item.getAttribute('aria-disabled') === 'true') {
        return;
    }

    closeToOpener();
}

useCloseOutside(panel, close);

defineExpose({ openAt });
</script>

<template>
    <div class="contents" @contextmenu="openFromPointer" @keydown="openFromKeyboard">
        <slot />
        <Transition
            enter-active-class="transition duration-(--duration-pop) ease-journal motion-reduce:transition-none"
            enter-from-class="translate-y-1 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
        >
            <div
                v-if="placed !== null"
                ref="panel"
                role="menu"
                :aria-label="label"
                class="fixed z-(--z-menu) flex max-w-82.5 min-w-55 flex-col rounded-menu border border-border-2 bg-raised p-1.5 shadow-(--shadow-pop)"
                :style="{ left: `${placed.x}px`, top: `${placed.y}px` }"
                @keydown="onKeydown"
                @keydown.tab="close"
                @keydown.escape.stop="closeToOpener"
                @click="closeAfterChoice"
            >
                <slot name="menu" />
            </div>
        </Transition>
    </div>
</template>
