<script setup lang="ts">
import type { IndeterminateProgressNode } from '@kit/dockCards';

/**
 * Progress whose total is unknown: its label, and no invented percentage.
 */
defineProps<{ node: IndeterminateProgressNode }>();
</script>

<template>
    <span class="text-small text-text-3">{{ node.label }}</span>
</template>
