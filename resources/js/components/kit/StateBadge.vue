<script setup lang="ts">
/**
 * A short state shown beside a record, such as Signed in or Needs sign-in: a dot and a word in the state's tone.
 * The caller gives the words; the tone only colours them, so the state never rests on colour alone.
 */
withDefaults(
    defineProps<{
        label: string;
        tone?: 'good' | 'warn' | 'danger' | 'busy' | 'quiet';
    }>(),
    { tone: 'quiet' },
);

const tones = {
    good: 'text-tone-good',
    warn: 'text-tone-warn',
    danger: 'text-danger',
    busy: 'text-tone-work',
    quiet: 'text-text-4',
} as const;
</script>

<template>
    <span
        class="inline-flex items-center gap-1.5 text-small"
        :class="tones[tone]"
    >
        <span
            class="size-1.5 rounded-full bg-current"
            :class="{ 'animate-pulse': tone === 'busy' }"
            aria-hidden="true"
        />
        <span>{{ label }}</span>
    </span>
</template>
