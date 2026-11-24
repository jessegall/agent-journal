<script setup lang="ts">
import Icon from "@kit/Icon";
import QuoteLine from "@kit/QuoteLine";
import type { ChatEntryData } from "@generated/types/chat";

/**
 * A reply's line above its text: who it answers and one line of the original, which pressing shows. An original on a
 * page not loaded yet is named by its number.
 */
const props = defineProps<{
  targetId: string;
  targetNumber: number;
  original: ChatEntryData | undefined;
  // The viewing actor as type:id, who reads its own original as You.
  viewer: string;
}>();

function nameOf(original: ChatEntryData): string {
  return original.author === props.viewer ? "You" : (original.authorLabel ?? "someone who left");
}

/** Gives the original the focus, so the keyboard continues from there. */
function showOriginal(): void {
  document.getElementById(`message-${props.targetId}`)?.focus();
}
</script>

<template>
  <template v-if="original !== undefined && original.message !== undefined">
    <QuoteLine :name="nameOf(original)" :text="original.message.body" @show="showOriginal" />
  </template>
  <template v-else>
    <span class="mb-1 flex max-w-full min-w-0 items-center gap-[5px] text-badge leading-4 text-text-3">
      <Icon name="reply" :size="13" class="flex-none text-text-4" />
      <span class="min-w-0 truncate italic">Reply to message {{ targetNumber }}</span>
    </span>
  </template>
</template>
