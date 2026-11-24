<script setup lang="ts">
import Icon from "@kit/Icon";
import QuoteLine from "@kit/QuoteLine";
import type { ReplyTargetData } from "@generated/types/chat";

/**
 * A reply's line above its text: who it answers and one line of the original, which pressing shows. An original the
 * viewer may not see says so in words.
 */
const props = defineProps<{
  target: ReplyTargetData;
  // The viewing actor as type:id, who reads its own original as You.
  viewer: string;
}>();

function speakerOf(original: NonNullable<ReplyTargetData["original"]>): string {
  return original.actor === props.viewer ? "You" : original.label;
}

/**
 * Gives the original the focus, so the keyboard continues from there.
 */
function showOriginal(): void {
  if (props.target.id === null) {
    return;
  }

  document.getElementById(`message-${props.target.id}`)?.focus();
}
</script>

<template>
  <template v-if="target.original !== undefined">
    <QuoteLine :name="speakerOf(target.original)" :text="target.original.excerpt" @show="showOriginal" />
  </template>
  <template v-else>
  <span
    class="mb-1 flex max-w-full min-w-0 items-center gap-[5px] text-badge leading-4 text-text-3"
  >
    <Icon name="reply" :size="13" class="flex-none text-text-4" />
    <span class="min-w-0 truncate italic">The original message is hidden from you.</span>
  </span>
  </template>
</template>
