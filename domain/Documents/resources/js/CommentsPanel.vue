<script setup lang="ts">
import { ref } from 'vue';
import { router, useForm } from '@inertiajs/vue3';
import type { CommentList, Section, TextSections } from '@kit/CoreTypes';
import { post as postRoute } from '@kit/CommentRoutes';
import CommentLocation from '@kit/CommentLocation';
import { describeRange, renderedLineRange, sections, subjectFields, type CommentSubject, type TextRangeChoice } from '@kit/TextComments';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import SourcePane from '@kit/SourcePane';
import SwitchCase from '@kit/SwitchCase';
import { formSendingHooks } from '@kit/usePageChanges';
import CommentEntry from './CommentEntry.vue';
import CommentPlace from './CommentPlace.vue';

/**
 * The comments on a record, oldest first, and the form that posts one. A comment is about the whole record unless the
 * reader chooses a place in the text: a section, the lines of selected paragraphs, or an exact quote confirmed in the
 * source. Only a record with text (a version) offers those choices.
 */
const props = defineProps<{
    comments: CommentList;
    target: string;
    version?: string;
}>();

const form = useForm({ target: props.target, body: '', submission_key: crypto.randomUUID() });
const subject = ref<CommentSubject>({ type: 'record' });
const sourceWindow = ref<{ firstLine: number; lastLine: number } | null>(null);
const sectionList = ref<Section[]>([]);
const openedId = ref<string | null>(null);

function choose(range: TextRangeChoice): void {
    subject.value = { type: 'text', range };
    sourceWindow.value = null;
}

function aboutWholeRecord(): void {
    subject.value = { type: 'record' };
}

/**
 * The lines of the paragraphs selected on the page, as a lines place; rendered text never gives a quote.
 */
function takeRenderedLines(): void {
    const lines = renderedLineRange(window.getSelection());

    if (lines !== null && props.version !== undefined) {
        choose({ type: 'lines', version: props.version, ...lines });
    }
}

/**
 * Opens the source of the selected paragraphs, where the reader picks and confirms an exact quote.
 */
function openSource(): void {
    sourceWindow.value = renderedLineRange(window.getSelection()) ?? { firstLine: 1, lastLine: 40 };
}

async function loadSections(): Promise<void> {
    const reply = await fetch(sections.url({ query: { target: props.target, version: props.version ?? '', per_page: 100 } }), { headers: { Accept: 'application/json' } });

    sectionList.value = reply.ok ? ((await reply.json()) as TextSections).items : [];
}

function post(): void {
    const sending = formSendingHooks();

    form.transform((fields) => ({ ...fields, ...subjectFields(subject.value) })).post(postRoute.url(), {
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

function open(commentId: string): void {
    openedId.value = commentId;
}
</script>

<template>
    <section class="flex flex-col gap-3">
        <h2 class="text-heading">Comments</h2>
        <template v-for="item in comments.items" :key="item.comment.id">
            <CommentEntry :comment="item.comment">
                <SwitchCase :value="item.type">
                    <template #record>
                        <button type="button" class="text-small text-left underline" @click="open(item.comment.id)">On the whole record: open record</button>
                    </template>
                    <template #text>
                        <template v-if="item.type === 'text'">
                            <CommentPlace :anchor="item.anchor" :current-version="version" @open="open(item.comment.id)" />
                        </template>
                    </template>
                </SwitchCase>
            </CommentEntry>
        </template>
        <template v-if="openedId">
            <CommentLocation :target="target" :comment-id="openedId" @close="openedId = null" />
        </template>
        <form class="flex flex-col gap-2" @submit.prevent="post">
            <p class="text-small text-text-3" aria-live="polite">
                <SwitchCase :value="subject.type">
                    <template #record>About the whole record</template>
                    <template #text>
                        <template v-if="subject.type === 'text'">About {{ describeRange(subject.range) }}</template>
                    </template>
                </SwitchCase>
            </p>
            <template v-if="sourceWindow && version">
                <SourcePane :target="target" :version="version" :first-line="sourceWindow.firstLine" :last-line="sourceWindow.lastLine" @choose="choose" @close="sourceWindow = null" />
            </template>
            <textarea v-model="form.body" class="input" rows="3" placeholder="Write a comment" />
            <div class="flex flex-wrap gap-2">
                <template v-if="version">
                    <Button @click="takeRenderedLines">Comment on the selected paragraphs</Button>
                    <Button @click="openSource">Choose exact text in the source</Button>
                    <Button @click="loadSections">Comment on a section</Button>
                    <template v-if="subject.type === 'text'">
                        <Button @click="aboutWholeRecord">About the whole record</Button>
                    </template>
                </template>
                <Button type="submit" variant="primary" :pending="form.processing" :disabled="form.processing">Post comment</Button>
            </div>
            <template v-if="sectionList.length > 0 && version">
                <ul class="flex flex-col gap-1">
                    <template v-for="section in sectionList" :key="section.number">
                        <li>
                            <Button @click="choose({ type: 'section', version, section: section.number }); sectionList = []">
                                {{ section.number }}. {{ section.heading || 'Before the first heading' }}
                            </Button>
                        </li>
                    </template>
                </ul>
            </template>
            <FormErrors :errors="form.errors" />
        </form>
    </section>
</template>
