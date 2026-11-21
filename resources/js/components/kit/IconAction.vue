<script setup lang="ts">
import Button from './Button.vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';

/**
 * Version 5's flush icon button with its tooltip: a 24 px square in one quiet grey, a slight fill on hover, and its
 * tip shown on hover or keyboard focus after a short delay. The label says the whole action for a screen reader; the
 * icon may draw smaller inside the same square.
 */
withDefaults(
    defineProps<{
        icon: IconName;
        tip: string;
        label: string;
        isPressed?: boolean;
        iconSize?: number;
    }>(),
    { isPressed: undefined, iconSize: 16 },
);
</script>

<template>
    <span class="group/tip relative inline-flex">
        <Button
            variant="icon"
            :aria-label="label"
            :aria-pressed="isPressed === undefined ? undefined : isPressed"
        >
            <Icon :name="icon" :size="iconSize" />
        </Button>
        <span
            role="tooltip"
            class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 rounded-button border border-(--tip-edge) bg-(--tip-bg) px-2 py-1 text-small whitespace-nowrap text-text opacity-0 shadow-(--tip-shadow) transition-opacity delay-0 group-focus-within/tip:opacity-100 group-hover/tip:opacity-100 group-hover/tip:delay-300"
            >{{ tip }}</span
        >
    </span>
</template>
