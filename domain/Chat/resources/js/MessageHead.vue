<script setup lang="ts">
import { computed } from "vue";
import Avatar from "@kit/Avatar";
import type { SpeakerData } from "@generated/types/chat";

/**
 * The line that heads another's message: the speaker's avatar (an agent's driver mark, or the user's initial), name
 * and time, whom it was addressed to, and at its right end the message's hover controls. The controls keep their room
 * while hidden, so this line sets the message's width when its text is shorter and nothing moves on hover.
 */
const props = defineProps<{
  speaker: SpeakerData;
  time: string;
  addressee: string | null;
}>();

const participant = computed(() => ({
  kind: props.speaker.driver === null ? ("user" as const) : ("agent" as const),
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
    <template v-if="$slots.actions">
      <span
        data-message-actions
        class="-my-px ml-auto flex h-[18px] items-center gap-0.5 pl-2.5 opacity-0 transition-opacity duration-(--duration-hover) group-focus-within/message:opacity-100 group-hover/message:opacity-100"
      >
        <slot name="actions" />
      </span>
    </template>
  </span>
</template>
