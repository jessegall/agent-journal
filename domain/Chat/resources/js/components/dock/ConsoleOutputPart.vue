<script setup lang="ts">
import { Link } from "@inertiajs/vue3";
import type { ConsoleOutputNode } from "@kit/dockCards";

/**
 * The last lines of a stream as plain text, whether earlier lines were left out, and its page when it has one.
 */
defineProps<{ node: ConsoleOutputNode }>();
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <pre
      class="max-h-40 overflow-auto rounded-control bg-code-bg p-2 text-caption whitespace-pre-wrap text-text-2"
      >{{ node.lines.join("\n") }}</pre>
    <template v-if="node.isTruncated">
      <span class="text-caption text-text-4">Earlier lines are left out.</span>
    </template>
    <template v-if="node.open">
      <Link :href="node.open.href" class="text-caption underline"
        >Open the output</Link
      >
    </template>
  </div>
</template>
