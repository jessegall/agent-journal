<script setup lang="ts">
import type { IndeterminateProgressNode } from "@kit/dockCards";
import ProgressMeter from "@kit/ProgressMeter";

/**
 * Progress whose total is unknown, its label and no invented percentage: the dock's adapter onto the kit's shared
 * progress meter.
 */
defineProps<{ node: IndeterminateProgressNode }>();
</script>

<template>
  <ProgressMeter :label="node.label" />
</template>
