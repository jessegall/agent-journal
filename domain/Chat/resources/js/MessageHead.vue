<script setup lang="ts">
import { computed } from 'vue';
import Avatar from '@kit/Avatar';
import type { SpeakerData } from '@generated/types/chat';

/**
 * The line that heads another's message: the speaker's avatar (an agent's driver mark, or the user's initial), name
 * and time, and whom it was addressed to.
 */
const props = defineProps<{ speaker: SpeakerData; time: string; addressee: string | null }>();

const participant = computed(() => ({
    kind: props.speaker.driver === null ? ('user' as const) : ('agent' as const),
    driver: props.speaker.driver ?? undefined,
    initials: props.speaker.label.slice(0, 1).toUpperCase(),
}));
</script>

<template>
    <span class="mb-0.5 flex items-center gap-[5px] text-badge text-text-3">
        <Avatar :participant="participant" />
        <span class="font-medium text-text-2">{{ speaker.label }}</span>
        <span>· {{ time }}</span>
        <template v-if="addressee !== null">
            <span>→ {{ addressee }}</span>
        </template>
    </span>
</template>
