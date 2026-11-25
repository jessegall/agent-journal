<script setup lang="ts">
import type { RecordCommentsPartData } from '@generated/types/comments';
import CommentsPanel from './partials/CommentsPanel.vue';

/**
 * A record's comments as a native part any record page mounts: the panel with its composer, and its text choices when
 * the part names the version.
 */
defineProps<RecordCommentsPartData>();
</script>

<template>
    <CommentsPanel
        :comments="comments"
        :target="target"
        :version="version"
        :reads="reads"
    />
</template>
