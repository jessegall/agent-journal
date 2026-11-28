<script setup lang="ts">
import Button from "@kit/Button";
import Icon from "@kit/Icon";
import type { RecoveryEntry } from "../../../composables/useMessageDrafts";

/**
 * A send the server refused, or one left over from before a reload: why it was not sent and its text, kept, with
 * Retry, which puts it back into the composer to send again, and Discard.
 */
defineProps<{ entry: RecoveryEntry; reason: string }>();

const emit = defineEmits<{
  restore: [intentKey: string];
  discard: [intentKey: string];
}>();
</script>

<template>
  <div class="flex max-w-[78%] flex-col items-end gap-[3px] self-end">
    <p
      class="rounded-[10px_10px_4px_10px] border border-border-2 px-3 py-2 text-body whitespace-pre-wrap text-text-2"
    >
      {{ entry.text }}
    </p>
    <span class="flex flex-wrap items-center justify-end gap-x-1.5 text-right text-meta leading-[15px] text-text-4">
      <span class="inline-flex items-center gap-1 font-medium text-danger"
        ><Icon name="alert" :size="12" />Not delivered</span
      >
      <span class="text-border-3">·</span>
      <span class="text-text-3">{{ reason }}</span>
      <Button
        size="small"
        variant="ghost"
        @click="emit('restore', entry.intentKey)"
        >Retry</Button
      >
      <Button
        size="small"
        variant="ghost"
        @click="emit('discard', entry.intentKey)"
        >Discard</Button
      >
    </span>
  </div>
</template>
