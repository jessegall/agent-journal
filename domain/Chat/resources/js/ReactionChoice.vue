<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import ChipButton from "@kit/ChipButton";
import Popover from "@kit/Popover";
import MessageAction from "./MessageAction.vue";

/**
 * React among a message's hover controls: it opens the choice of an emoji to react with. It is the one way to add a
 * reaction; under a message only the reactions that were given show.
 */
defineProps<{ label: string }>();

const emit = defineEmits<{ choose: [emoji: string] }>();

const EMOJIS = ["👍", "❤️", "🎉", "👀", "✅", "🙏"];

const isChoosing = ref(false);
const word = useTemplateRef<InstanceType<typeof MessageAction>>("word");
// The button the choice opens under.
const opener = computed(() => (word.value?.$el as HTMLElement | undefined) ?? null);

function choose(emoji: string): void {
  isChoosing.value = false;
  emit("choose", emoji);
}
</script>

<template>
  <MessageAction ref="word" icon="smile" :label="label" aria-haspopup="dialog" @click="isChoosing = !isChoosing">
    React
  </MessageAction>
  <Popover v-model:open="isChoosing" label="Choose a reaction" :anchor="opener">
    <div class="flex gap-1 p-1.5">
      <template v-for="emoji in EMOJIS" :key="emoji">
        <ChipButton size="md" @click="choose(emoji)">{{ emoji }}</ChipButton>
      </template>
    </div>
  </Popover>
</template>
