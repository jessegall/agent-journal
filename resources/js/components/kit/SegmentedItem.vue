<script setup lang="ts">
import { inject } from 'vue';
import { segmentedKey } from './segmented';

/**
 * One choice of a SegmentedControl: a radio with --text-small in --text-3, padding 2 10 and radius --radius-seg;
 * the chosen one is --sel and --text. Only the chosen item is a tab stop; the ring sits inside (offset -2).
 */
const props = defineProps<{ value: string; bare?: boolean; disabled?: boolean }>();
const group = inject(segmentedKey);
</script>

<template>
    <button
        type="button"
        role="radio"
        :aria-checked="group?.chosen.value === props.value"
        :tabindex="group?.chosen.value === props.value ? 0 : -1"
        :data-segment="props.value"
        :disabled="disabled"
        :class="bare ? undefined : [
            'rounded-seg px-2.5 py-0.5 text-small whitespace-nowrap transition-colors duration-(--duration-hover) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
            group?.chosen.value === props.value ? 'bg-sel text-text' : 'text-text-3 hover:text-text-2',
        ]"
        @click="group?.choose(props.value)"
    >
        <slot />
    </button>
</template>
