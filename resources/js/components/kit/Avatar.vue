<script setup lang="ts">
import { computed } from 'vue';
import DriverMark from './DriverMark.vue';
import type { Participant } from './participant';

/**
 * A participant: agents are rounded squares holding their driver mark, users and you are circles with initials,
 * the journal is a square holding "J". sm is 16 px (radius 4, mark 11), lg is 26 px (radius 8, mark 16). Beside a
 * visible name it is hidden from assistive technology; given a label it stands alone as an image with that name.
 */
const props = withDefaults(defineProps<{ participant: Participant; size?: 'sm' | 'lg'; label?: string }>(), {
    size: 'sm',
    label: undefined,
});

const round = computed(() => props.participant.kind === 'user' || props.participant.kind === 'you');
const initials = computed(() => props.participant.initials ?? (props.participant.kind === 'you' ? 'Y' : ''));
const frame = computed(() => {
    if (round.value) {
        return 'rounded-full border-border-3 bg-raised';
    }

    return [props.size === 'sm' ? 'rounded-badge border-border-2' : 'rounded-field border-border-2 bg-bg'];
});
</script>

<template>
    <span
        :role="label ? 'img' : undefined"
        :aria-label="label"
        :aria-hidden="label ? undefined : true"
        class="inline-flex shrink-0 items-center justify-center border"
        :class="[size === 'sm' ? 'size-4' : 'size-6.5', frame]"
    >
        <template v-if="participant.kind === 'agent'">
            <DriverMark :driver="participant.driver ?? ''" :size="size === 'sm' ? 11 : 16" />
        </template>
        <template v-else-if="participant.kind === 'journal'">
            <span class="text-meta font-semibold text-text">J</span>
        </template>
        <template v-else>
            <span
                class="font-semibold text-text-2"
                :class="size === 'sm' ? 'text-meta' : 'text-badge'"
                >{{ initials }}</span
            >
        </template>
    </span>
</template>
