<script setup lang="ts">
import type { CountedProgressNode } from '@kit/dockCards';
import ProgressMeter from '@kit/ProgressMeter';

/**
 * Done work against the known total, such as 3 of 8: the dock's adapter onto the kit's shared progress meter.
 */
defineProps<{ node: CountedProgressNode }>();
</script>

<template>
    <ProgressMeter
        :label="`${node.completed} of ${node.total}`"
        :completed="node.completed"
        :total="node.total"
    />
</template>
