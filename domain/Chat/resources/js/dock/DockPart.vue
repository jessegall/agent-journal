<script setup lang="ts">
import type { Component } from 'vue';
import type { DockNode } from '@kit/dockCards';
import ButtonPart from './parts/ButtonPart.vue';
import ChatExcerptPart from './parts/ChatExcerptPart.vue';
import ConsoleOutputPart from './parts/ConsoleOutputPart.vue';
import CountedProgressPart from './parts/CountedProgressPart.vue';
import DisclosurePart from './parts/DisclosurePart.vue';
import DurationPart from './parts/DurationPart.vue';
import GroupPart from './parts/GroupPart.vue';
import IndeterminateProgressPart from './parts/IndeterminateProgressPart.vue';
import RowPart from './parts/RowPart.vue';
import StackPart from './parts/StackPart.vue';
import StateLabelPart from './parts/StateLabelPart.vue';
import SubtitlePart from './parts/SubtitlePart.vue';
import TitlePart from './parts/TitlePart.vue';

/**
 * One part of a docked card, drawn by the renderer of its type. The map names a renderer for every type the part map
 * generates, so a type without one fails the type check.
 */
defineProps<{ node: DockNode; path: string }>();

const renderers: Record<DockNode['type'], Component> = {
    stack: StackPart,
    row: RowPart,
    group: GroupPart,
    disclosure: DisclosurePart,
    title: TitlePart,
    subtitle: SubtitlePart,
    'state-label': StateLabelPart,
    'counted-progress': CountedProgressPart,
    'indeterminate-progress': IndeterminateProgressPart,
    duration: DurationPart,
    'console-output': ConsoleOutputPart,
    'chat-excerpt': ChatExcerptPart,
    button: ButtonPart,
};
</script>

<template>
    <component :is="renderers[node.type]" :node="node" :path="path" />
</template>
