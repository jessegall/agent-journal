<script setup lang="ts">
import type { StateLabelNode } from '@kit/dockCards';

/**
 * A short state word in its tone.
 */
defineProps<{ node: StateLabelNode }>();

const tones: Record<StateLabelNode['tone'], string> = {
    neutral: 'bg-chip text-text-2',
    good: 'text-tone-good',
    warn: 'text-tone-warn',
    danger: 'text-danger',
    note: 'bg-chip text-text-2',
    muted: 'text-text-4',
};
</script>

<template>
    <span class="w-fit rounded-control px-1.5 text-caption" :class="tones[node.tone]">{{ node.text }}</span>
</template>
