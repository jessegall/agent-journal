<script setup lang="ts">
import type { StateLabelNode } from '@kit/dockCards';
import ToneLabel from '@kit/ToneLabel';

/**
 * A short state word in its tone: the dock's adapter onto the kit's shared tone label.
 */
defineProps<{ node: StateLabelNode }>();
</script>

<template>
    <ToneLabel :text="node.text" :tone="node.tone" />
</template>
