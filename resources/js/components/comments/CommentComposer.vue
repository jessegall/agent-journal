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

/**
 * Writes one comment on a record. It is about the whole record unless the reader chooses a place in the text: a
 * section, the lines of selected paragraphs, or an exact quote confirmed in the source. A record without text (no
 * version) offers no such choice. A retry of the same draft keeps its submission key; a failed post keeps the text and
 * the chosen place.
 */
const props = defineProps<{ target: string; version?: string; reads?: RecordReadsData }>();

const form = useForm({ target: props.target, body: '', submission_key: crypto.randomUUID() });
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

function send(): void {
    const sending = formSendingHooks();

    form.transform((fields) => ({ ...fields, ...subjectFields(subject.value) })).post(post.url(), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset('body');
            form.submission_key = crypto.randomUUID();
            subject.value = { type: 'record' };
        },
        onStart: sending.onStart,
        onFinish: () => {
            sending.onFinish();

            if (!form.wasSuccessful && !form.hasErrors) {
                router.reload();
            }
        },
    });
}
</script>

<template>
    <TextComposer v-model="form.body" :pending="form.processing" :errors="form.errors" placeholder="Write a comment" send-label="Post comment" @send="send">
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
