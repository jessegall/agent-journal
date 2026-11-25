<script setup lang="ts">
import type { TaskCommentsData } from '@generated/types/tasks';
import CommentsPanel from '@domain/comments/components/CommentsPanel.vue';

/**
 * A task's comments as its Comments tab: the kit's panel with its composer.
 */
defineProps<TaskCommentsData>();
</script>

<template>
    <CommentsPanel :comments="comments" :target="target" />
</template>
