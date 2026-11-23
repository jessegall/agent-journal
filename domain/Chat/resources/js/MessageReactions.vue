<script setup lang="ts">
import ChipButton from "@kit/ChipButton";
import type { ChatMessageData } from "@generated/types/chat";
import ReactionChoice from "./ReactionChoice.vue";
import { toggleReaction } from "./reactions";

/**
 * The reactions a message has, as the design draws them: a chip per emoji with its count, your own marked, pressed to
 * take it back or to add yours, and a small add chip after them. A message without reactions draws nothing here: React
 * among its hover controls adds the first.
 */
const props = defineProps<{
  message: ChatMessageData;
  inboxId: string;
  conversationProp: string;
}>();

function toggle(emoji: string): void {
  toggleReaction(props.inboxId, props.message.id, emoji, props.conversationProp);
}
</script>

<template>
  <template v-if="message.reactions.length > 0">
    <div class="mt-1.5 flex flex-wrap items-center gap-1" aria-label="Reactions">
      <template v-for="reaction in message.reactions" :key="reaction.emoji">
        <ChipButton
          size="sm"
          :count="reaction.count"
          :pressed="reaction.isMine"
          :mine="reaction.isMine"
          :aria-label="`${reaction.emoji} ${reaction.count}`"
          @click="toggle(reaction.emoji)"
        >
          {{ reaction.emoji }}
        </ChipButton>
      </template>
      <ReactionChoice variant="chip" label="Add a reaction" @choose="toggle" />
    </div>
  </template>
</template>
