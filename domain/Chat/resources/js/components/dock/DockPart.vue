<script setup lang="ts">
import type { Component } from "vue";
import type { DockNode } from "@kit/dockCards";
import ButtonPart from "./ButtonPart.vue";
import ChatExcerptPart from "./ChatExcerptPart.vue";
import ConsoleOutputPart from "./ConsoleOutputPart.vue";
import CountedProgressPart from "./CountedProgressPart.vue";
import DisclosurePart from "./DisclosurePart.vue";
import DurationPart from "./DurationPart.vue";
import GroupPart from "./GroupPart.vue";
import IndeterminateProgressPart from "./IndeterminateProgressPart.vue";
import RowPart from "./RowPart.vue";
import StackPart from "./StackPart.vue";
import StateLabelPart from "./StateLabelPart.vue";
import SubtitlePart from "./SubtitlePart.vue";
import TitlePart from "./TitlePart.vue";

/**
 * One part of a docked card, drawn by the renderer of its type. The map names a renderer for every type the part map
 * generates, so a type without one fails the type check.
 */
defineProps<{ node: DockNode; path: string }>();

const renderers: Record<DockNode["type"], Component> = {
  stack: StackPart,
  row: RowPart,
  group: GroupPart,
  disclosure: DisclosurePart,
  title: TitlePart,
  subtitle: SubtitlePart,
  "state-label": StateLabelPart,
  "counted-progress": CountedProgressPart,
  "indeterminate-progress": IndeterminateProgressPart,
  duration: DurationPart,
  "console-output": ConsoleOutputPart,
  "messages-excerpt": ChatExcerptPart,
  button: ButtonPart,
};
</script>

<template>
  <component :is="renderers[node.type]" :node="node" :path="path" />
</template>
