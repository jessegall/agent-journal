<script setup lang="ts">
import type { CountedProgressNode } from '@kit/dockCards';

/**
 * Done work against the known total: a bar and its words, such as 3 of 8.
 */
defineProps<{ node: CountedProgressNode }>();
</script>

<template>
    <div class="flex items-center gap-2 text-small text-text-3">
        <span
            role="progressbar"
            :aria-valuenow="node.completed"
            aria-valuemin="0"
            :aria-valuemax="node.total"
            :aria-valuetext="`${node.completed} of ${node.total}`"
            class="h-1 w-24 overflow-hidden rounded-full bg-bar-track"
        >
            <span class="block h-full bg-progress" :style="{ width: `${(node.completed / node.total) * 100}%` }"></span>
        </span>
        <span>{{ node.completed }} of {{ node.total }}</span>
    </div>
</template>
