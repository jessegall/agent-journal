<script setup lang="ts">
import { ref, watch } from 'vue';
import { router, useForm } from '@inertiajs/vue3';
import type { RecordReadsData } from '@/generated/types/documents';
import type { Section } from '@/generated/types/core';
import { post } from '@/routes/comments';
import Button from '@/components/kit/Button.vue';
import SwitchItem from '@/components/kit/SwitchItem.vue';
import { formSendingHooks } from '@/composables/usePageChanges';
import SourcePane from '@/components/text/SourcePane.vue';
import TextComposer from '@/components/text/TextComposer.vue';
import { describeRange, subjectFields, type CommentSubject, type TextRangeChoice } from '@/components/text/textRange';
import { renderedLineRange } from '@/components/text/useRenderedSelection';
import { clearCommentThread, type CommentThread } from './commentThreads';

/**
 * Writes one comment on a record. It is about the whole record unless the reader chooses a place in the text: a
 * section, the lines of selected paragraphs, or an exact quote confirmed in the source. A record without text (no
 * version) offers no such choice. A retry of the same draft keeps its submission key; a failed post keeps the text and
 * the chosen place. Given a pane's thread, the draft and its key live there, so they last across tabs; a post whose
 * answer is lost is frozen as it was sent and can only be checked by replaying it under its key, after which Send as
 * new comment takes a fresh key; a refusal (403) clears the draft, the attempt and the key.
 */
const props = defineProps<{ target: string; version?: string; reads?: RecordReadsData; thread?: CommentThread }>();

const form = useForm({
    target: props.target,
    body: props.thread?.draft.body ?? '',
    submission_key: props.thread?.draft.key ?? crypto.randomUUID(),
});

watch(
    () => form.body,
    (body) => {
        if (props.thread !== undefined) {
            props.thread.draft.body = body;
        }
    },
);
const subject = ref<CommentSubject>({ type: 'record' });
const sourceWindow = ref<{ firstLine: number; lastLine: number } | null>(null);
const sectionList = ref<Section[]>([]);

function choose(range: TextRangeChoice): void {
    subject.value = { type: 'text', range };
    sourceWindow.value = null;
    sectionList.value = [];
}

function takeRenderedLines(): void {
    const lines = renderedLineRange(window.getSelection());

    if (lines !== null && props.version !== undefined) {
        choose({ type: 'lines', version: props.version, ...lines });
    }
}

function openSource(): void {
    sourceWindow.value = renderedLineRange(window.getSelection()) ?? { firstLine: 1, lastLine: 40 };
}

// The record page answers the sections it was asked for beside the record.
watch(
    () => props.reads?.textSections,
    (sections) => {
        if (sections !== undefined) {
            sectionList.value = sections.items;
        }
    },
);

function loadSections(): void {
    router.reload({ only: ['page'], data: { sectionsVersion: props.version ?? '' } });
}

function freshKey(): void {
    form.submission_key = crypto.randomUUID();

    if (props.thread !== undefined) {
        props.thread.draft.key = form.submission_key;
    }
}

function freeze(fields: Record<string, unknown>): boolean {
    if (props.thread !== undefined) {
        props.thread.attempt = { fields, key: form.submission_key };
        props.thread.isChecked = false;
    }

    return false;
}

function refuse(response: { status: number }): boolean {
    if (props.thread !== undefined && response.status === 403) {
        clearCommentThread(props.thread);
        form.body = '';
        form.submission_key = props.thread.draft.key;

        return false;
    }

    return props.thread === undefined;
}

function check(): void {
    const thread = props.thread;
    const attempt = thread?.attempt;

    if (thread === undefined || attempt === null || attempt === undefined) {
        return;
    }

    const generation = thread.generation;
    router.post(post.url(), attempt.fields as Record<string, string>, {
        preserveScroll: true,
        onSuccess: () => {
            if (thread.generation !== generation) {
                return;
            }

            thread.attempt = null;
            thread.isChecked = true;
            freshKey();
        },
        onNetworkError: () => false,
        onHttpException: refuse,
    });
}

function send(): void {
    const sending = formSendingHooks();
    const fields = {
        target: form.target,
        body: form.body,
        submission_key: form.submission_key,
        ...subjectFields(subject.value),
    };
    const generation = props.thread?.generation ?? 0;

    form.transform((formFields) => ({ ...formFields, ...subjectFields(subject.value) })).post(post.url(), {
        preserveScroll: true,
        onNetworkError: () => freeze(fields),
        onHttpException: refuse,
        onSuccess: () => {
            if (props.thread !== undefined && props.thread.generation !== generation) {
                return;
            }

            form.reset('body');
            freshKey();
            subject.value = { type: 'record' };

            if (props.thread !== undefined) {
                props.thread.isChecked = false;
            }
        },
        onStart: sending.onStart,
        onFinish: () => {
            sending.onFinish();

            if (!form.wasSuccessful && !form.hasErrors && props.thread === undefined) {
                router.reload();
            }
        },
    });
}
</script>

<template>
    <template v-if="thread?.attempt">
        <p role="status" class="flex flex-wrap items-center gap-2 text-small text-text-2">
            <span>Outcome unknown: your comment may or may not have been posted.</span>
            <Button variant="bordered" @click="check">Check comment</Button>
        </p>
    </template>
    <TextComposer
        v-model="form.body"
        :pending="form.processing"
        :errors="form.errors"
        placeholder="Write a comment"
        :send-label="thread?.isChecked ? 'Send as new comment' : 'Post comment'"
        :send-disabled="thread?.attempt !== null && thread?.attempt !== undefined"
        @send="send"
    >
        <template #before>
            <p class="text-small text-text-3" aria-live="polite">
                <SwitchItem :item="subject" by="type">
                    <template #record>About the whole record</template>
                    <template #text="{ item: text }">About {{ describeRange(text.range) }}</template>
                </SwitchItem>
            </p>
            <template v-if="sourceWindow && version">
                <SourcePane :target="target" :version="version" :first-line="sourceWindow.firstLine" :last-line="sourceWindow.lastLine" :found="reads?.textPart" @choose="choose" @close="sourceWindow = null" />
            </template>
        </template>
        <template #actions>
            <template v-if="version">
                <Button @click="takeRenderedLines">Comment on the selected paragraphs</Button>
                <Button @click="openSource">Choose exact text in the source</Button>
                <Button @click="loadSections">Comment on a section</Button>
                <template v-if="subject.type === 'text'">
                    <Button @click="subject = { type: 'record' }">About the whole record</Button>
                </template>
            </template>
        </template>
        <template #after>
            <template v-if="sectionList.length > 0 && version">
                <ul class="flex flex-col gap-1">
                    <template v-for="section in sectionList" :key="section.number">
                        <li>
                            <Button @click="choose({ type: 'section', version, section: section.number })">{{ section.number }}. {{ section.heading || 'Before the first heading' }}</Button>
                        </li>
                    </template>
                </ul>
            </template>
        </template>
    </TextComposer>
</template>
