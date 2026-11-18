<script setup lang="ts">
import type { RecordCommentView, TextCommentView } from '@/generated/types/core';
import SwitchCase from '@/components/kit/SwitchCase.vue';

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
        <SwitchCase :value="item.type">
            <template #record>
                <button type="button" class="text-small text-left underline" @click="$emit('open', comment.id)">On the whole record: open record</button>
            </template>
            <template #text>
                <template v-if="item.type === 'text'">
                    <button type="button" class="text-small text-left underline" @click="$emit('open', comment.id)">
                        On {{ item.anchor.versionLabel }}, lines {{ item.anchor.firstLine }}–{{ item.anchor.lastLine }}
                        <template v-if="currentVersion !== undefined && item.anchor.versionId !== currentVersion"> (an older version): open original location</template>
                    </button>
                </template>
            </template>
        </SwitchCase>
        <div class="prose" v-html="comment.bodyHtml" />
    </article>
</template>
