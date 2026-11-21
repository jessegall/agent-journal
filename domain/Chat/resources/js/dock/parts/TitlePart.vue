<script setup lang="ts">
import type { TitleNode } from '@kit/dockCards';

/**
 * The card's fixed heading.
 */
defineProps<{ node: TitleNode }>();
</script>

<template>
    <h3 class="truncate text-body font-semibold text-text">{{ node.text }}</h3>
</template>
