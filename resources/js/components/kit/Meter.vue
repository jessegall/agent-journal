<script setup lang="ts">
import { computed } from 'vue';

/**
 * A thin share bar from 0 to its maximum (100 unless given): a meter with its value, maximum and a label such as 72%
 * used, read aloud with its unit. Its width is fixed or fluid up to 220 px, and its track changes inside a selected
 * row. Measures: docs/designs/kit-components.md.
 */
const props = withDefaults(
    defineProps<{
        value: number;
        max?: number;
        unit?: string;
        size?: 'sm' | 'md' | 'lg';
        width?: number;
        fluid?: boolean;
        label: string;
    }>(),
    { max: 100, unit: undefined, size: 'sm', width: 56, fluid: false },
);

const reading = computed(() => Math.min(props.max, Math.max(0, props.value)));
const share = computed(() => (props.max === 0 ? 0 : (reading.value / props.max) * 100));
const spoken = computed(() => (props.unit === undefined ? undefined : `${reading.value} of ${props.max} ${props.unit}`));
</script>

<template>
    <span
        role="meter"
        :aria-valuenow="reading"
        aria-valuemin="0"
        :aria-valuemax="max"
        :aria-valuetext="spoken"
        :aria-label="label"
        class="inline-block overflow-hidden bg-sel in-aria-selected:bg-border-3 in-data-selected:bg-border-3"
        :class="[
            fluid ? 'w-full max-w-55 min-w-0' : 'shrink-0',
            { 'h-1 rounded-xs': size === 'sm', 'h-1.25 rounded-[3px]': size === 'md', 'h-1.5 rounded-[3px]': size === 'lg' },
        ]"
        :style="fluid ? undefined : { width: `${width}px` }"
    >
        <span class="block h-full bg-brand" :style="{ width: `${share}%` }" />
    </span>
</template>
