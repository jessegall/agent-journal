<script setup lang="ts">
/**
 * A short state shown beside a record, such as Signed in or Needs sign-in: a dot and a word in the state's tone,
 * outlined in it when asked. The caller gives the words; the tone only colours them, so the state never rests on
 * colour alone. A busy dot pulses, and stands still for a reader who asks for reduced motion.
 */
withDefaults(
    defineProps<{
        label: string;
        tone?: 'good' | 'warn' | 'danger' | 'busy' | 'quiet';
        outlined?: boolean;
    }>(),
    { tone: 'quiet', outlined: false },
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
        :class="[tones[tone], { 'rounded-badge border border-current px-1.5 py-0.5': outlined }]"
    >
        <span
            class="size-1.5 rounded-full bg-current"
            :class="{ 'animate-pulse motion-reduce:animate-none': tone === 'busy' }"
            aria-hidden="true"
        />
        <span>{{ label }}</span>
    </span>
</template>
