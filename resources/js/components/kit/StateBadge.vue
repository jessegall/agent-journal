<script setup lang="ts">
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';

/**
 * A short state shown beside a record, such as Signed in or Needs sign-in: a dot or the state's own icon and a word
 * in the state's tone, outlined in it when asked; a state that has not begun or is absent has a hollow dot. The caller gives the words; the tone only colours them, so the
 * state never rests on colour alone. A busy dot pulses, and stands still for a reader who asks for reduced motion.
 */
withDefaults(
    defineProps<{
        label: string;
        tone?: StateTone;
        outlined?: boolean;
        icon?: IconName;
    }>(),
    { tone: 'quiet', outlined: false, icon: undefined },
);

export type StateTone = 'good' | 'warn' | 'danger' | 'busy' | 'quiet' | 'sequence' | 'paused' | 'waiting';

const tones: Record<StateTone, string> = {
    good: 'text-tone-good',
    warn: 'text-tone-warn',
    danger: 'text-danger',
    busy: 'text-tone-work',
    quiet: 'text-text-4',
    sequence: 'text-tone-sequence',
    paused: 'text-tone-paused',
    waiting: 'text-text-4',
};
</script>

<template>
    <span
        class="inline-flex items-center gap-1.5 text-small"
        :class="[tones[tone], { 'rounded-badge border border-current px-1.5 py-0.5': outlined }]"
    >
        <template v-if="icon">
            <Icon :name="icon" :size="12" />
        </template>
        <template v-else>
            <span
                class="rounded-full"
                :class="
                    tone === 'waiting'
                        ? 'size-[7px] border-[1.5px] border-current bg-transparent'
                        : ['size-1.5 bg-current', { 'animate-pulse motion-reduce:animate-none': tone === 'busy' }]
                "
                aria-hidden="true"
            />
        </template>
        <span>{{ label }}</span>
    </span>
</template>
