<script setup lang="ts">
import { useCloseOutside } from '@/composables/useCloseOutside';
import { ref } from 'vue';

/**
 * Version 5's menu column (windows/PaneMenu.vue with kit/MenuItem.vue and kit/MenuLabel.vue): 240 px on the raised
 * colour, items of 12 px in the second text colour with padding 6 by 8, a label line above a group, and a top border
 * where a group starts. A disabled item is drawn at 45 %. It closes on a choice, a click outside or Escape.
 */
export type MenuEntry = {
    label: string;
    run: () => void;
    disabled?: boolean;
    checked?: boolean;
    startsGroup?: boolean;
    groupLabel?: string;
};

defineProps<{ entries: MenuEntry[]; title?: string }>();

const emit = defineEmits<{ done: [] }>();

const panel = ref<HTMLElement | null>(null);

function choose(entry: MenuEntry): void {
    entry.run();
    emit('done');
}

useCloseOutside(panel, () => emit('done'));
</script>

<template>
    <div
        ref="panel"
        role="menu"
        class="z-90 flex max-h-[min(70vh,560px)] w-60 [scrollbar-width:thin] flex-col gap-px overflow-y-auto rounded-field border border-border-2 bg-raised p-1 shadow-[0_8px_24px_rgb(0_0_0/28%)]"
    >
        <template v-if="title">
            <span
                class="truncate px-2 pt-1.5 pb-1 text-group font-semibold tracking-[.06em] text-text-4 uppercase"
                >{{ title }}</span
            >
        </template>
        <template v-for="entry in entries" :key="entry.label">
            <template v-if="entry.groupLabel">
                <span
                    class="px-2 pt-2.5 pb-0.5 text-group font-semibold tracking-[.06em] text-text-4 uppercase"
                    >{{ entry.groupLabel }}</span
                >
            </template>
            <button
                type="button"
                role="menuitem"
                :disabled="entry.disabled"
                class="flex items-center gap-2 rounded-control px-2 py-1.5 text-left text-small text-text-2 enabled:hover:bg-hover enabled:hover:text-text disabled:cursor-default disabled:opacity-45"
                :class="{
                    'mt-1.5 rounded-t-none border-t border-border pt-2':
                        entry.startsGroup,
                }"
                @click="choose(entry)"
            >
                <template v-if="entry.checked !== undefined">
                    <span class="w-3 flex-none" aria-hidden="true">{{
                        entry.checked ? '✓' : ''
                    }}</span>
                </template>
                {{ entry.label }}
            </button>
        </template>
    </div>
</template>
