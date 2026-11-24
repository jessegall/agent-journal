<script setup lang="ts">
import ChipButton from "@kit/ChipButton";
import type { ReactionCount } from "../../../chatEntries";
import { sendReaction } from "../../../reactions";

/**
 * The reactions a message has, as the design draws them: a chip per emoji with its count, your own marked, pressed to
 * add yours. A reaction is a reply, so one given stays; a message without reactions draws nothing here.
 */
const props = defineProps<{
  reactions: ReactionCount[];
  messageId: string;
  inboxId: string;
  conversationProp: string;
}>();

function add(reaction: ReactionCount): void {
  if (!reaction.isOwn) {
    sendReaction(props.inboxId, props.messageId, reaction.emoji, props.conversationProp);
  }
}
</script>

<template>
  <template v-if="reactions.length > 0">
    <div class="mt-1.5 flex flex-wrap items-center gap-1" aria-label="Reactions">
      <template v-for="reaction in reactions" :key="reaction.emoji">
        <ChipButton
          size="sm"
          :count="reaction.count"
          :pressed="reaction.isOwn"
          :own="reaction.isOwn"
          :aria-label="`${reaction.emoji} ${reaction.count}`"
          @click="add(reaction)"
        >
          {{ reaction.emoji }}
        </ChipButton>
      </template>
    </div>
  </template>
</template>
