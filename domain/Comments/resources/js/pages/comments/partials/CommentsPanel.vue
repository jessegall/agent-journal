<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import type { CommentList, RecordCommentView, TextCommentView } from '@generated/types/comments';
import type { RecordReadsData } from '@generated/types/comments';
import Button from '@kit/Button';
import CommentComposer from './CommentComposer.vue';
import CommentItem from './CommentItem.vue';
import CommentLocation from './CommentLocation.vue';
import { clearCommentThread, type CommentThread } from './commentThreads';
import { onReconnected } from '@kit/retainedPages';

/**
 * A record's comments, oldest first, read on a page at a time, and the form that writes one. The record's version is
 * given only for a record with text; without it the form offers no text choices. More comments come as the page read
 * again with the comment to go on after. A refresh puts the first page's comments back in place by id and keeps the
 * pages read after it; a failed continuation keeps the rows and the cursor. Given a pane's thread, its draft and lost
 * attempt last across tabs, and a refusal clears the thread and the rows.
 */
const props = defineProps<{
    target: string;
    comments: CommentList;
    version?: string;
    reads?: RecordReadsData;
    thread?: CommentThread;
}>();

const items = ref<(RecordCommentView | TextCommentView)[]>([...props.comments.items]);
const nextAfter = ref<string | null>(props.comments.nextAfter);
const failure = ref('');
const openedId = ref<string | null>(null);

// Set while the page is read again for the comments after the last one shown, so that read adds to the list.
let isReadingMore = false;

watch(
    () => props.comments,
    (fresh) => {
        const shownIds = new Set(items.value.map((item) => item.comment.id));
        const freshIds = new Set(fresh.items.map((item) => item.comment.id));
        const laterPages = items.value.filter((item) => !freshIds.has(item.comment.id));

        if (isReplacingAfterReconnect) {
            items.value = [...fresh.items];
            nextAfter.value = fresh.nextAfter;
            isReplacingAfterReconnect = false;
        } else if (isReadingMore) {
            items.value = [...items.value, ...fresh.items.filter((item) => !shownIds.has(item.comment.id))];
            nextAfter.value = fresh.nextAfter;
        } else {
            items.value = [...fresh.items, ...laterPages];
            nextAfter.value = laterPages.length === 0 ? fresh.nextAfter : nextAfter.value;
        }

        isReadingMore = false;
    },
);

/**
 * Reads the next comments as the page itself: the page is read again with the comment to go on after, and only the
 * page's own prop comes back.
 */
// After a reconnect the page's catch-up read brings the first page again; the pages read after it are dropped then,
// since an allowed first page does not vouch for older rows.
let isReplacingAfterReconnect = false;

onReconnected(() => {
    isReplacingAfterReconnect = true;
});

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
        onNetworkError: () => {
            isReadingMore = false;
            failure.value = 'The next comments could not be read.';

            return false;
        },
        onHttpException: (response) => {
            isReadingMore = false;

            if (response.status === 403 && props.thread !== undefined) {
                clearCommentThread(props.thread);
                items.value = [];
                nextAfter.value = null;
            }

            failure.value = 'The next comments could not be read.';

            return false;
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
        <CommentComposer :target="target" :version="version" :reads="reads" :thread="thread" />
    </section>
</template>
