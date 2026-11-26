<script setup lang="ts">
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';

/**
 * A short state beside a record, such as Signed in: a dot or the state's icon and the caller's word in its tone,
 * outlined when asked; a state that has not started or is absent has a hollow dot. A busy dot pulses, but not under
 * reduced motion.
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
