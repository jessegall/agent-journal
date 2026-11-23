<script setup lang="ts">
import type { QuestionActionsData, SpeakerData } from "@generated/types/chat";
import MessageAction from "./MessageAction.vue";
import ReactionChoice from "./ReactionChoice.vue";

/**
 * The hover controls of another's message, in the order the design draws them on its name line: React, then Reply
 * (Answer when the message asks you something), then Decline where the server offers it.
 */
defineProps<{ speaker: SpeakerData; actions: QuestionActionsData }>();

const emit = defineEmits<{ react: [emoji: string]; reply: []; decline: [] }>();
</script>

<template>
  <ReactionChoice variant="word" :label="`React to ${speaker.label}'s message`" @choose="(emoji) => emit('react', emoji)" />
  <MessageAction icon="reply" @click="emit('reply')">
    {{ actions.answer ? "Answer" : "Reply" }}
  </MessageAction>
  <template v-if="actions.decline">
    <MessageAction @click="emit('decline')">Decline</MessageAction>
  </template>
</template>
