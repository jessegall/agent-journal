<script setup lang="ts">
/**
 * A short state word in its tone, shared by the dock's cards and the pages; the tone only colours the word, so the
 * state it names stays readable without it.
 */
export type LabelTone = 'neutral' | 'good' | 'warn' | 'danger' | 'note' | 'muted';

defineProps<{ text: string; tone: LabelTone }>();

const tones: Record<LabelTone, string> = {
    neutral: 'bg-chip text-text-2',
    good: 'text-tone-good',
    warn: 'text-tone-warn',
    danger: 'text-danger',
    note: 'bg-chip text-text-2',
    muted: 'text-text-4',
};
</script>

<template>
    <span class="w-fit rounded-control px-1.5 text-caption" :class="tones[tone]">{{
        text
    }}</span>
</template>
