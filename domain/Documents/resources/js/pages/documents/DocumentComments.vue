<script setup lang="ts">
import { useHostProp } from '@kit/hostProp';
import { router } from '@inertiajs/vue3';
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import Block from '@kit/Block';
import CommentBar from '@kit/CommentBar';
import CommentThread from '@kit/CommentThread';
import LineCommentable from '@kit/LineCommentable';
import MenuItem from '@kit/MenuItem';
import MenuTrigger from '@kit/MenuTrigger';
import Button from '@kit/Button';
import type { DocumentCommentsPartData } from '@generated/types/documents';
import { draftFor, sendLineComment } from '@kit/lineComments';

/**
 * A document's text drawn as its Markdown blocks (headings, paragraphs, list items and code) that a reader comments on:
 * select text across blocks, or press Comment (C) on one, and the bar opens under the last selected block (below the
 * range on a phone). A comment and a feedback request name the lines of the revision the chosen blocks were read from.
 * The draft is kept for the revision and those lines, so leaving and coming back finds it; a send that fails keeps its
 * text and offers Retry, which sends the same comment again. The thread under a commented block shows Read by only
 * when a delivery receipt says so, and Reply and the chat button are left out, since this part supplies neither.
 * Choosing a recipient sends the feedback request and puts the focus back on the feedback control once it was taken.
 */
const props = defineProps<DocumentCommentsPartData>();
const hostProp = useHostProp();

const state = ref<'idle' | 'sending' | 'failed'>('idle');
const feedback = useTemplateRef<HTMLElement>('feedback');
const hasFeedback = computed(() => props.feedbackAddress !== undefined && props.recipients.length > 0);

/** The place, from one, of the block that holds a line of the revision. */
function blockOf(line: number): number {
    return props.blocks.findIndex((block) => line >= block.firstLine && line <= block.lastLine) + 1;
}

const commentedBlocks = computed(() => [...new Set(props.threads.map((thread) => blockOf(thread.lastLine)))]);

/** The first line of the first chosen block and the last line of the last. */
function linesOf(from: number, to: number): { first: number; last: number } {
    return { first: props.blocks[from - 1].firstLine, last: props.blocks[to - 1].lastLine };
}

function textOf(from: number, to: number): string {
    return props.blocks
        .slice(from - 1, to)
        .map((block) => block.text)
        .join(' ');
}

/** A block's text cut where `code` starts and ends, so the code reads in mono. */
function piecesOf(text: string): { text: string; isCode: boolean }[] {
    return text.split(/`([^`]+)`/).map((piece, index) => ({ text: piece, isCode: index % 2 === 1 }));
}

function threadsEndingAt(block: number) {
    return props.threads.filter((thread) => blockOf(thread.lastLine) === block);
}

function rangeWords(first: number, last: number): string {
    return first === last ? `line ${first}` : `lines ${first}–${last}`;
}

function send(from: number, to: number, close: () => void): void {
    const { first, last } = linesOf(from, to);
    state.value = 'sending';
    sendLineComment(props.target, props.revision, first, last, {
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

    const { first, last } = linesOf(from, to);
    router.post(
        props.feedbackAddress,
        { agent: recipientId, first_line: first, last_line: last },
        {
            preserveScroll: true,
            onSuccess: () => void nextTick(() => feedback.value?.querySelector<HTMLElement>('button')?.focus()),
        },
    );
}
</script>

<template>
    <section aria-label="Document text" class="flex flex-col gap-2">
        <LineCommentable
            :line-count="blocks.length"
            :commented-lines="commentedBlocks"
            whole-label="Comment on this document"
        >
            <template #line="{ line, selected, commented }">
                <Block
                    :kind="blocks[line - 1].type"
                    :line="line"
                    :selected="selected"
                    :commented="commented"
                    :class="{ 'ml-4.5 list-item': blocks[line - 1].type === 'item' }"
                    ><template v-for="(piece, index) in piecesOf(blocks[line - 1].text)" :key="index"
                        ><template v-if="piece.isCode"
                            ><code class="font-mono text-small">{{ piece.text }}</code></template
                        ><template v-else>{{ piece.text }}</template></template
                    ></Block
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
                        v-model="draftFor(target, revision, linesOf(from, to).first, linesOf(from, to).last).text"
                        :from="linesOf(from, to).first"
                        :to="linesOf(from, to).last"
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
        <p class="mt-3.5 text-badge text-text-3">Select text to comment on it.</p>
    </section>
</template>
