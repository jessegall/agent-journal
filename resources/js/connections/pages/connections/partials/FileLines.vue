<script setup lang="ts">
import { useHostProp } from '@kit/hostProp';
import type { FileThreadData } from '@generated/types/connections';
import CodeLine from '@kit/CodeLine';
import CommentBar from '@kit/CommentBar';
import CommentThread from '@kit/CommentThread';
import LineCommentable from '@kit/LineCommentable';
import Toggle from '@kit/Toggle';
import { keyedPost } from '@kit/keyedPost';
import { draftFor, sendLineComment } from '@kit/lineComments';
import { computed, ref } from 'vue';
import RetryLine from './RetryLine.vue';

/**
 * A file's lines a reader comments on: select lines, then Comment, and the bar opens under the last one; the draft is
 * kept for the version and range, and a failed send offers Retry. A comment to the main agent also tells it in the
 * chat, and Send again resends only that message.
 */
const props = defineProps<{
    target: string;
    version: string;
    path: string;
    lines: string[];
    threads: FileThreadData[];
    recipientId: string | null;
    recipientName: string | null;
    commentAddress: string;
    messageAddress: string;
}>();
const hostProp = useHostProp();

const state = ref<'idle' | 'sending' | 'failed'>('idle');
const isForRecipient = ref(props.recipientId !== null);
// The message telling the agent about a saved comment that could not be sent, kept so Send again sends that one.
const untold = ref<{ key: string; message: { agent: string; path: string; first_line: number; last_line: number; comment: string } } | null>(null);

function message(): void {
    if (untold.value === null) {
        return;
    }

    keyedPost(props.messageAddress, untold.value.message, untold.value.key, {
        onAccepted: () => (untold.value = null),
        onRefused: () => undefined,
        onUncertain: () => undefined,
    });
}
const commentedLines = computed(() => [...new Set(props.threads.map((thread) => thread.lastLine))]);

function threadsEndingAt(line: number): FileThreadData[] {
    return props.threads.filter((thread) => thread.lastLine === line);
}

function rangeWords(from: number, to: number): string {
    return from === to ? `line ${from}` : `lines ${from}–${to}`;
}

function send(from: number, to: number, close: () => void): void {
    const comment = draftFor(props.target, props.version, from, to).text;

    state.value = 'sending';
    sendLineComment(props.commentAddress, props.target, props.version, from, to, {
        only: [hostProp],
        onSent: () => {
            state.value = 'idle';
            close();

            if (isForRecipient.value && props.recipientId !== null) {
                untold.value = {
                    key: crypto.randomUUID(),
                    message: { agent: props.recipientId, path: props.path, first_line: from, last_line: to, comment },
                };
                message();
            }
        },
        onFailed: () => (state.value = 'failed'),
    });
}
</script>

<template>
    <template v-if="untold !== null">
        <RetryLine action="Send again" @retry="message">Saved, but {{ recipientName }} was not told.</RetryLine>
    </template>
    <LineCommentable :line-count="lines.length" :commented-lines="commentedLines">
        <template #line="{ line, selected, cursor, commented, pick, step, comment }">
            <CodeLine
                :line="line"
                :selected="selected"
                :cursor="cursor"
                :marker="commented ? 'comment' : undefined"
                @pick="pick"
                @step="step"
                @comment="comment"
                >{{ lines[line - 1] }}</CodeLine
            >
        </template>
        <template #thread="{ line }">
            <template v-for="thread in threadsEndingAt(line)" :key="`${thread.firstLine}-${thread.lastLine}`">
                <CommentThread
                    :author="thread.comments[0]?.author ?? ''"
                    name=""
                    :lines="rangeWords(thread.firstLine, thread.lastLine)"
                    :text="thread.comments[0]?.body ?? ''"
                    :is-sent="true"
                    :replies="thread.comments.slice(1).map((reply, index) => ({ id: index, author: reply.author, text: reply.body }))"
                    :has-receipt="false"
                    :can-reply="false"
                    :can-open-chat="false"
                />
            </template>
        </template>
        <template #bar="{ from, to, close }">
            <div class="flex flex-col gap-1">
                <CommentBar
                    v-model="draftFor(target, version, from, to).text"
                    :from="from"
                    :to="to"
                    :quote="lines.slice(from - 1, to).join(' ')"
                    @send="send(from, to, close)"
                    @cancel="close"
                >
                    <template v-if="recipientName !== null">
                        <span class="flex items-center gap-2 text-small text-text-2">
                            <Toggle v-model="isForRecipient" :label="`To ${recipientName}`" />
                            <span class="truncate">{{ recipientName }}</span>
                        </span>
                    </template>
                </CommentBar>
                <template v-if="state === 'failed'">
                    <RetryLine action="Retry" @retry="send(from, to, close)">
                        The comment was not sent. Your text is kept.
                    </RetryLine>
                </template>
            </div>
        </template>
    </LineCommentable>
</template>
