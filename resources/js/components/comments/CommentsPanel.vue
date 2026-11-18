<script setup lang="ts">
import { ref, watch } from 'vue';
import type { CommentList, RecordCommentView, TextCommentView } from '@/generated/types/core';
import { list } from '@/routes/comments';
import Button from '@/components/kit/Button.vue';
import CommentComposer from './CommentComposer.vue';
import CommentItem from './CommentItem.vue';
import CommentLocation from './CommentLocation.vue';

/**
 * A record's comments, oldest first, read on a page at a time, and the form that writes one. The record's version is
 * given only for a record with text; without it the form offers no text choices. A refused read clears what was shown.
 */
const props = defineProps<{ target: string; comments: CommentList; version?: string }>();

const items = ref<(RecordCommentView | TextCommentView)[]>([...props.comments.items]);
const nextAfter = ref<string | null>(props.comments.nextAfter);
const failure = ref('');
const openedId = ref<string | null>(null);

watch(
    () => props.comments,
    (fresh) => {
        items.value = [...fresh.items];
        nextAfter.value = fresh.nextAfter;
    },
);

async function readMore(): Promise<void> {
    const reply = await fetch(list.url({ query: { target: props.target, after: nextAfter.value ?? '' } }), { headers: { Accept: 'application/json' } });

    if (!reply.ok) {
        items.value = [];
        nextAfter.value = null;
        failure.value = ((await reply.json()) as { message: string }).message;

        return;
    }

    const page = (await reply.json()) as CommentList;
    items.value = [...items.value, ...page.items];
    nextAfter.value = page.nextAfter;
}
</script>

<template>
    <section class="flex flex-col gap-3">
        <h2 class="text-heading">Comments</h2>
        <template v-if="failure">
            <p class="text-small text-warn">{{ failure }}</p>
        </template>
        <template v-for="item in items" :key="item.comment.id">
            <CommentItem :item="item" :current-version="version" @open="openedId = $event" />
        </template>
        <template v-if="nextAfter">
            <div>
                <Button @click="readMore">Show more comments</Button>
            </div>
        </template>
        <template v-if="openedId">
            <CommentLocation :target="target" :comment-id="openedId" @close="openedId = null" />
        </template>
        <CommentComposer :target="target" :version="version" />
    </section>
</template>
