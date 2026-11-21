<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import type { CommentList, RecordCommentView, TextCommentView } from '@/generated/types/core';
import type { RecordReadsData } from '@/generated/types/documents';
import Button from '@/components/kit/Button.vue';
import CommentComposer from './CommentComposer.vue';
import CommentItem from './CommentItem.vue';
import CommentLocation from './CommentLocation.vue';

/**
 * A record's comments, oldest first, read on a page at a time, and the form that writes one. The record's version is
 * given only for a record with text; without it the form offers no text choices. More comments come as the page read
 * again with the comment to go on after.
 */
const props = defineProps<{ target: string; comments: CommentList; version?: string; reads?: RecordReadsData }>();

const items = ref<(RecordCommentView | TextCommentView)[]>([...props.comments.items]);
const nextAfter = ref<string | null>(props.comments.nextAfter);
const failure = ref('');
const openedId = ref<string | null>(null);

// Set while the page is read again for the comments after the last one shown, so that read adds to the list.
let isReadingMore = false;

watch(
    () => props.comments,
    (fresh) => {
        items.value = isReadingMore ? [...items.value, ...fresh.items] : [...fresh.items];
        nextAfter.value = fresh.nextAfter;
        isReadingMore = false;
    },
);

/**
 * Reads the next comments as the page itself: the page is read again with the comment to go on after, and only the
 * page's own prop comes back.
 */
function readMore(): void {
    isReadingMore = true;
    failure.value = '';
    router.reload({
        only: ['page'],
        data: { commentsAfter: nextAfter.value ?? '' },
        onError: () => {
            isReadingMore = false;
            failure.value = 'The next comments could not be read.';
        },
    });
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
            <CommentLocation :target="target" :comment-id="openedId" :found="reads?.commentLocation" @close="openedId = null" />
        </template>
        <CommentComposer :target="target" :version="version" :reads="reads" />
    </section>
</template>
