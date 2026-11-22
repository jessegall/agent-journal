<script setup lang="ts">
import type { RecordCommentsPartData } from '@generated/types/documents';
import CommentsPanel from '@kit/CommentsPanel';

/**
 * A record's comments as a native part of its layout: the kit's panel with its composer.
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
