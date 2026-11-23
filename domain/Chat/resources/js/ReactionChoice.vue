<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import ChipButton from "@kit/ChipButton";
import Icon from "@kit/Icon";
import Popover from "@kit/Popover";
import MessageAction from "./MessageAction.vue";

/**
 * The choice of an emoji to react with, opened from its own button: the word React among a message's hover controls,
 * or the small add chip beside the reactions a message already has.
 */
defineProps<{ variant: "word" | "chip"; label: string }>();

const emit = defineEmits<{ choose: [emoji: string] }>();

const EMOJIS = ["👍", "❤️", "🎉", "👀", "✅", "🙏"];

const isChoosing = ref(false);
const word = useTemplateRef<InstanceType<typeof MessageAction>>("word");
const chip = useTemplateRef<HTMLButtonElement>("chip");
// The button the choice opens under: the word's own element, or the chip.
const opener = computed(() => (word.value?.$el as HTMLElement | undefined) ?? chip.value);

function choose(emoji: string): void {
  isChoosing.value = false;
  emit("choose", emoji);
}
</script>

<template>
  <template v-if="variant === 'word'">
    <MessageAction ref="word" icon="smile" :label="label" aria-haspopup="dialog" @click="isChoosing = !isChoosing">
      React
    </MessageAction>
  </template>
  <template v-else>
    <button
      ref="chip"
      type="button"
      aria-haspopup="dialog"
      :aria-label="label"
      class="inline-flex h-5.5 items-center rounded-seg border border-line px-1.5 text-text-3 hover:border-border-3 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      @click="isChoosing = !isChoosing"
    >
      <Icon name="plus" :size="12" />
    </button>
  </template>
  <Popover v-model:open="isChoosing" label="Choose a reaction" :anchor="opener">
    <div class="flex gap-1 p-1.5">
      <template v-for="emoji in EMOJIS" :key="emoji">
        <ChipButton size="md" @click="choose(emoji)">{{ emoji }}</ChipButton>
      </template>
    </div>
  </Popover>
</template>
