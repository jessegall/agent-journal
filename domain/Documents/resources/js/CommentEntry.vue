<script setup lang="ts">
import type { CommentDetails } from '@kit/CoreTypes';

/**
 * One comment: who left it and when, the place it is about (the slot), and its text.
 */
defineProps<{ comment: CommentDetails }>();
</script>

<template>
    <article class="flex flex-col gap-1">
        <p class="text-small text-text-3">{{ comment.authorType }} {{ comment.authorId }} · {{ comment.createdAt }}</p>
        <slot />
        <div class="prose" v-html="comment.bodyHtml" />
    </article>
</template>
