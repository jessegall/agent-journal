<script setup lang="ts">
import { computed } from 'vue';
import type { Arrangement } from './arrangement';
import { paneBoxes } from './paneLayout';

/**
 * Version 5's layout thumbnail (LayoutThumb.vue): 46 by 32 with a pane per cell, the chat's pane in accent at 55 % and
 * the others in the second border colour; the current layout's thumbnail has a darker border.
 */
const props = defineProps<{
    arrangement: Arrangement;
    firstWindow: string;
    isCurrent: boolean;
}>();

const cells = computed(() =>
    paneBoxes(props.arrangement.grid).map((box) => ({
        key: box.pane.id,
        isFirstWindow: box.pane.windows.includes(props.firstWindow),
        style: {
            left: `calc(${box.left * 100}% + 1px)`,
            top: `calc(${box.top * 100}% + 1px)`,
            width: `calc(${box.width * 100}% - 2px)`,
            height: `calc(${box.height * 100}% - 2px)`,
        },
    })),
);
</script>

<template>
    <span
        class="relative h-8 w-[46px] flex-none overflow-hidden rounded-badge border bg-bg-2"
        :class="isCurrent ? 'border-text-4' : 'border-border-2'"
        aria-hidden="true"
    >
        <template v-for="cell in cells" :key="cell.key">
            <span
                class="absolute rounded-[2px]"
                :class="cell.isFirstWindow ? 'bg-brand/55' : 'bg-border-2'"
                :style="cell.style"
            ></span>
        </template>
    </span>
</template>
