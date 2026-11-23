<script setup lang="ts">
import type { GroupNode } from "@kit/dockCards";
import DockPart from "../DockPart.vue";

/**
 * Parts together under their label.
 */
defineProps<{ node: GroupNode; path: string }>();
</script>

<template>
  <div role="group" :aria-label="node.label" class="flex flex-col gap-1">
    <span class="text-caption font-semibold text-text-3">{{ node.label }}</span>
    <template v-for="child in node.children" :key="child.key">
      <DockPart :node="child" :path="`${path}/${child.key}`" />
    </template>
  </div>
</template>
