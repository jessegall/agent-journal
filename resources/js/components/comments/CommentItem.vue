<script setup lang="ts">
import type { RecordCommentView, TextCommentView } from '@/generated/types/core';
import SwitchVariant from '@/components/kit/SwitchVariant.vue';

/**
 * One comment in a list: who left it and when, what it is about, and its text. A whole-record comment offers to open
 * its record; a text comment names its version and lines, says when that version is older, and opens its place.
 */
const props = defineProps<{ item: RecordCommentView | TextCommentView; currentVersion?: string }>();

defineEmits<{ open: [commentId: string] }>();

const comment = props.item.comment;
</script>

<template>
    <article class="flex flex-col gap-1">
        <p class="text-small text-text-3">{{ comment.authorType }} {{ comment.authorId }} · {{ comment.createdAt }}</p>
        <SwitchVariant :subject="item" by="type">
            <template #record>
                <button type="button" class="text-small text-left underline" @click="$emit('open', comment.id)">On the whole record: open record</button>
            </template>
            <template #text="{ subject: textItem }">
                <button type="button" class="text-small text-left underline" @click="$emit('open', comment.id)">
                    On {{ textItem.anchor.versionLabel }}, lines {{ textItem.anchor.firstLine }}–{{ textItem.anchor.lastLine }}
                    <template v-if="currentVersion !== undefined && textItem.anchor.versionId !== currentVersion"> (an older version): open original location</template>
                </button>
            </template>
        </SwitchVariant>
        <div class="prose" v-html="comment.bodyHtml" />
    </article>
</template>
