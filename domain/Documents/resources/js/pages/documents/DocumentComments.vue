<script setup lang="ts">
import { useHostProp } from '@kit/hostProp';
import { router } from '@inertiajs/vue3';
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import CodeLine from '@kit/CodeLine';
import CommentBar from '@kit/CommentBar';
import CommentThread from '@kit/CommentThread';
import LineCommentable from '@kit/LineCommentable';
import MenuItem from '@kit/MenuItem';
import MenuTrigger from '@kit/MenuTrigger';
import Button from '@kit/Button';
import type { DocumentCommentsPartData } from '@generated/types/documents';
import { draftFor, sendLineComment } from '@kit/lineComments';

/**
 * A document's text with the numbered lines a reader comments on: select lines with the mouse or the gutter, or press
 * Comment (C) on a line, and the bar opens under the last selected line (below the range on a phone). The draft is kept
 * for the revision and range, so leaving and coming back finds it; a send that fails keeps its text and offers Retry,
 * which sends the same comment again for the same revision and range. The thread under a commented line shows Read by
 * only when a delivery receipt says so, and Reply and the chat button are left out, since this part supplies neither.
 * Choosing a recipient sends the feedback request and puts the focus back on the feedback control once it was taken.
 */
const props = defineProps<DocumentCommentsPartData>();
const hostProp = useHostProp();

const state = ref<'idle' | 'sending' | 'failed'>('idle');
const feedback = useTemplateRef<HTMLElement>('feedback');
const commentedLines = computed(() => [...new Set(props.threads.map((thread) => thread.lastLine))]);
const hasFeedback = computed(() => props.feedbackAddress !== undefined && props.recipients.length > 0);

function textOf(from: number, to: number): string {
    return props.blocks
        .filter((block) => block.line >= from && block.line <= to)
        .map((block) => block.text)
        .join(' ');
}

function threadsEndingAt(line: number) {
    return props.threads.filter((thread) => thread.lastLine === line);
}

function rangeWords(from: number, to: number): string {
    return from === to ? `line ${from}` : `lines ${from}–${to}`;
}

function send(from: number, to: number, close: () => void): void {
    state.value = 'sending';
    sendLineComment(props.target, props.revision, from, to, {
        only: [hostProp],
        onSent: () => {
            state.value = 'idle';
            close();
        },
        onFailed: () => (state.value = 'failed'),
    });
}

function sendFeedback(recipientId: string, from: number, to: number): void {
    if (props.feedbackAddress === undefined) {
        return;
    }

    router.post(
        props.feedbackAddress,
        { recipient: recipientId, target: props.target, version: props.revision, first_line: from, last_line: to },
        {
            preserveScroll: true,
            onSuccess: () => void nextTick(() => feedback.value?.querySelector<HTMLElement>('button')?.focus()),
        },
    );
}
</script>

<template>
    <section aria-label="Document text" class="flex flex-col gap-2">
        <LineCommentable :line-count="blocks.length" :commented-lines="commentedLines" whole-label="Comment on this document">
            <template #line="{ line, selected, cursor, commented, pick, step, comment }">
                <CodeLine
                    :line="line"
                    :selected="selected"
                    :cursor="cursor"
                    :marker="commented ? 'comment' : undefined"
                    @pick="pick"
                    @step="step"
                    @comment="comment"
                    >{{ blocks[line - 1].text }}</CodeLine
                >
            </template>
            <template #thread="{ line }">
                <template v-for="thread in threadsEndingAt(line)" :key="thread.id">
                    <CommentThread
                        :author="thread.author"
                        :name="thread.recipient ?? ''"
                        :lines="rangeWords(thread.firstLine, thread.lastLine)"
                        :text="thread.text"
                        :is-sent="thread.readBy !== undefined"
                        :replies="[]"
                        :has-receipt="thread.readBy !== undefined"
                        :can-reply="false"
                        :can-open-chat="false"
                    />
                </template>
            </template>
            <template #bar="{ from, to, close }">
                <div class="flex flex-col gap-1 max-[760px]:order-last">
                    <CommentBar
                        v-model="draftFor(target, revision, from, to).text"
                        :from="from"
                        :to="to"
                        :quote="textOf(from, to)"
                        @send="send(from, to, close)"
                        @cancel="close"
                    >
                        <template v-if="hasFeedback">
                            <div ref="feedback">
                                <MenuTrigger variant="field" label="Send feedback to">
                                    <template v-for="recipient in recipients" :key="recipient.id">
                                        <MenuItem @click="sendFeedback(recipient.id, from, to)">{{
                                            recipient.name
                                        }}</MenuItem>
                                    </template>
                                </MenuTrigger>
                            </div>
                        </template>
                    </CommentBar>
                    <template v-if="state === 'failed'">
                        <p role="alert" class="flex items-center gap-2 text-small text-text-2">
                            The comment was not sent. Your text is kept.
                            <Button size="sm" variant="bordered" @click="send(from, to, close)">Retry</Button>
                        </p>
                    </template>
                </div>
            </template>
        </LineCommentable>
    </section>
</template>
