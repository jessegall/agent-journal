<script setup lang="ts">
import type { RowNode } from "@kit/dockCards";
import DockPart from "./DockPart.vue";

/**
 * Parts side by side in their order, wrapping on a narrow card, placed by the row's alignment.
 */
defineProps<{ node: RowNode; path: string }>();

const placements: Record<RowNode["alignment"], string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-2"
    :class="placements[node.alignment]"
  >
    <template v-for="child in node.children" :key="child.key">
      <DockPart :node="child" :path="`${path}/${child.key}`" />
    </template>
  </div>
</template>
