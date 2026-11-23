<script setup lang="ts">
import type { SubtitleNode } from "@kit/dockCards";

/**
 * Secondary text under the heading.
 */
defineProps<{ node: SubtitleNode }>();
</script>

<template>
  <p class="truncate text-small text-text-3">{{ node.text }}</p>
</template>
