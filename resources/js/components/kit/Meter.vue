<script setup lang="ts">
import { computed } from 'vue';

/**
 * A thin share bar from 0 to 100: role meter with its value and a label such as "72% used". Its track turns
 * --border-3 inside a selected row.
 */
const props = withDefaults(
    defineProps<{ value: number; size?: 'sm' | 'md' | 'lg'; width?: number; label: string }>(),
    { size: 'sm', width: 56 },
);

const share = computed(() => Math.min(100, Math.max(0, props.value)));
</script>

<template>
    <span
        role="meter"
        :aria-valuenow="share"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="label"
        class="inline-block shrink-0 overflow-hidden bg-sel in-aria-selected:bg-border-3"
        :class="{ 'h-1 rounded-xs': size === 'sm', 'h-1.25 rounded-[3px]': size === 'md', 'h-1.5 rounded-[3px]': size === 'lg' }"
        :style="{ width: `${width}px` }"
    >
        <span class="block h-full bg-brand" :style="{ width: `${share}%` }" />
    </span>
</template>
