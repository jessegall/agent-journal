<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import Button from '@/components/kit/Button.vue';
import ChipButton from '@/components/kit/ChipButton.vue';
import Dialog from '@/components/kit/Dialog.vue';
import Spinner from '@/components/kit/Spinner.vue';
import Textarea from '@/components/kit/Textarea.vue';
import type { DraftQuestionData } from '@/generated/types/core';
import type { DraftedRecordData } from '@/types/generated';
import { draftFrom, readQuestions } from './draftRequests';
import { useGuidedCreation } from './guidedCreation';

/**
 * The guided way to start a record: the draft producer's questions one at a time with suggested answers and free text,
 * then the drafting, which keeps every answer on failure, and Open the draft, which hands the fields back. Nothing is
 * saved here.
 */
const { request, end } = useGuidedCreation();
const stage = ref<'loading' | 'asking' | 'drafting' | 'failed' | 'ready'>('loading');
const questions = ref<DraftQuestionData[]>([]);
const answers = ref<string[]>([]);
const typed = ref('');
const draft = ref<DraftedRecordData | null>(null);
const isTyping = ref(false);
const root = ref<HTMLElement | null>(null);

const step = computed(() => answers.value.length);
const question = computed(() => questions.value[step.value]);

watch(request, async (asked) => {
    answers.value = [];
    typed.value = '';
    draft.value = null;

    if (asked === null) {
        return;
    }

    stage.value = 'loading';

    try {
        questions.value = (await readQuestions(asked.noun)).questions;
        stage.value = 'asking';
    } catch {
        stage.value = 'failed';
    }
});

function choose(suggestion: string): void {
    isTyping.value = false;
    void answer(suggestion);
}

async function answer(text: string): Promise<void> {
    const given = text.trim();

    if (given === '') {
        return;
    }

    answers.value = [...answers.value, given];
    typed.value = '';

    if (answers.value.length < questions.value.length) {
        await focusAnswer();

        return;
    }

    await makeDraft();
}

async function focusAnswer(): Promise<void> {
    await nextTick();
    const target = isTyping.value ? 'textarea' : '[data-first-suggestion]';

    root.value?.parentElement?.querySelector<HTMLElement>(target)?.focus();
}

async function makeDraft(): Promise<void> {
    const asked = request.value;

    if (asked === null) {
        return;
    }

    stage.value = 'drafting';
    await nextTick();
    document.querySelector<HTMLElement>('[role="dialog"]')?.focus();

    try {
        draft.value = await draftFrom(asked.noun, answers.value);
        stage.value = 'ready';
        await nextTick();
        document.querySelector<HTMLElement>('[data-open-draft]')?.focus();
    } catch {
        stage.value = 'failed';
    }
}

function retry(): void {
    if (questions.value.length > 0) {
        void makeDraft();

        return;
    }

    const asked = request.value;

    if (asked !== null) {
        request.value = { ...asked };
    }
}

function changeLastAnswer(): void {
    typed.value = answers.value.at(-1) ?? '';
    answers.value = answers.value.slice(0, -1);
    stage.value = 'asking';
    void focusAnswer();
}

function openDraft(): void {
    if (request.value !== null && draft.value !== null) {
        request.value.onDraft(draft.value);
    }

    end();
}
</script>

<template>
    <Dialog
        :open="request !== null"
        :title="`Start a ${request?.noun ?? 'record'} with questions`"
        initial-focus="[data-first-suggestion]"
        @close="end"
    >
        <div ref="root" class="flex flex-col gap-3" :aria-busy="stage === 'drafting' || stage === 'loading'">
            <template v-if="stage === 'loading'">
                <p role="status" class="flex items-center gap-2 text-text-3"><Spinner /> Reading the questions</p>
            </template>
            <template v-else-if="stage === 'asking' && question !== undefined">
                <p class="text-small text-text-3">Question {{ step + 1 }} of {{ questions.length }}</p>
                <p class="text-text">{{ question.prompt }}</p>
                <div class="flex flex-wrap gap-2">
                    <template v-for="(suggestion, index) in question.suggestions" :key="suggestion">
                        <ChipButton
                            size="md"
                            shape="pill"
                            :data-first-suggestion="index === 0 ? '' : undefined"
                            @click="choose(suggestion)"
                            >{{ suggestion }}</ChipButton
                        >
                    </template>
                </div>
                <Textarea v-model="typed" :rows="3" @input="isTyping = true" />
                <div class="flex items-center gap-2">
                    <Button variant="primary" :disabled="typed.trim() === ''" @click="answer(typed)">Next</Button>
                    <template v-if="step > 0">
                        <Button variant="ghost" @click="changeLastAnswer">Change the last answer</Button>
                    </template>
                </div>
            </template>
            <template v-else-if="stage === 'drafting'">
                <p role="status" class="flex items-center gap-2 text-text-2"><Spinner /> Drafting</p>
            </template>
            <template v-else-if="stage === 'failed'">
                <p role="alert" class="text-text">
                    {{ questions.length === 0 ? 'The questions could not be read.' : 'The draft could not be made. Your answers are kept.' }}
                </p>
                <div class="flex items-center gap-2">
                    <Button variant="primary" @click="retry">Retry</Button>
                    <template v-if="step > 0">
                        <Button variant="ghost" @click="changeLastAnswer">Change the last answer</Button>
                    </template>
                </div>
            </template>
            <template v-else-if="stage === 'ready' && draft !== null">
                <p class="text-text">The draft is ready. Drafted by {{ draft.agent }}.</p>
                <div>
                    <Button variant="primary" data-open-draft @click="openDraft">Open the draft</Button>
                </div>
            </template>
        </div>
        <template #footer>
            <Button variant="ghost" @click="end">Cancel</Button>
        </template>
    </Dialog>
</template>
