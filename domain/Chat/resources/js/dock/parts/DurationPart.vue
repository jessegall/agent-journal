<script setup lang="ts">
import type { DurationNode } from '@kit/dockCards';
import ElapsedTime from '@kit/ElapsedTime';

/**
 * How long something ran, counted while it runs and fixed at its finish: the dock's adapter onto the kit's shared
 * elapsed time.
 */
defineProps<{ node: DurationNode }>();
</script>

<template>
    <ElapsedTime :started-at="node.startedAt" :finished-at="node.finishedAt" />
</template>
