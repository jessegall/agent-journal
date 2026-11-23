<script setup lang="ts">
import { router } from "@inertiajs/vue3";
import { ref, useTemplateRef } from "vue";
import ChipButton from "@kit/ChipButton";
import Icon from "@kit/Icon";
import Popover from "@kit/Popover";
import type { ChatMessageData } from "@generated/types/chat";
import { react } from "@generated/routes/chat";

/**
 * A message's reactions as the design draws them: a chip per emoji with its count, your own marked, pressed to take it
 * back or to add yours; and an add button opening the emoji choice.
 */
const props = defineProps<{
  message: ChatMessageData;
  inboxId: string;
  conversationProp: string;
}>();

const EMOJIS = ["👍", "❤️", "🎉", "👀", "✅", "🙏"];

const isChoosing = ref(false);
const addButton = useTemplateRef<HTMLButtonElement>("addButton");

function toggle(emoji: string): void {
  isChoosing.value = false;
  router.post(
    react().url,
    { inboxId: props.inboxId, messageId: props.message.id, emoji },
    {
      preserveScroll: true,
      preserveState: true,
      only: [props.conversationProp],
    },
  );
}
</script>

<template>
  <div
    class="relative flex flex-wrap items-center gap-1"
    aria-label="Reactions"
  >
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
    <button
      ref="addButton"
      type="button"
      aria-label="Add a reaction"
      class="inline-flex h-5.5 items-center rounded-seg border border-line px-1.5 text-text-3 hover:border-border-3 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
      @click="isChoosing = !isChoosing"
    >
      <Icon name="plus" :size="12" />
    </button>
    <Popover
      v-model:open="isChoosing"
      label="Choose a reaction"
      :anchor="addButton"
    >
      <div class="flex gap-1 p-1.5">
        <template v-for="emoji in EMOJIS" :key="emoji">
          <ChipButton size="md" @click="toggle(emoji)">{{ emoji }}</ChipButton>
        </template>
      </div>
    </Popover>
  </div>
</template>
