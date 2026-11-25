<script setup lang="ts">
import { timeOfDay } from "@kit/format";
import { Link } from "@inertiajs/vue3";
import type { MessagesExcerptNode } from "@kit/dockCards";

/**
 * A few messages as plain text, with who wrote each and when, and the conversation's page when it may be opened.
 */
defineProps<{ node: MessagesExcerptNode }>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <ul class="flex flex-col gap-1">
      <template
        v-for="message in node.messages"
        :key="`${message.sentAt}-${message.speaker}`"
      >
        <li class="text-small text-text-2">
          <span class="font-medium">{{ message.speaker }}</span>
          <span class="text-text-4"> · {{ timeOfDay(message.sentAt) }}</span>
          <p class="truncate">{{ message.preview }}</p>
        </li>
      </template>
    </ul>
    <template v-if="node.open">
      <Link :href="node.open.href" class="text-caption underline"
        >Open the conversation</Link
      >
    </template>
  </div>
</template>
