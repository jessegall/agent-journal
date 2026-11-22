<script setup lang="ts">
import { computed } from 'vue';

/**
 * A count on the corner of an icon button. It hides at 0 and shows "99+" past the maximum. The number is repeated
 * in the button's own label, so the badge is hidden from assistive technology.
 */
const props = withDefaults(defineProps<{ count: number; max?: number }>(), { max: 99 });

const text = computed(() => (props.count > props.max ? `${props.max}+` : String(props.count)));
</script>

<template>
    <span
        v-if="count > 0"
        aria-hidden="true"
        class="absolute -top-0.5 -right-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-brand px-[3px] text-meta font-semibold text-on-brand"
        >{{ text }}</span
    >
</template>
