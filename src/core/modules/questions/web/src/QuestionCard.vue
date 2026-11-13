<script setup>
import {ref} from "vue";
import {TextInput, TimeAgo, peekRef, useWindow} from "@journal/window-kit";
import QuestionActions from "./QuestionActions.vue";

// one question as version 4 asked it: a card with the options under each other, the recommended one tagged, and a box for an answer in the user's own words;
// an answer shows the moment it is given and goes back if the server refuses it;
// flush is the questions window's look: one block edge to edge, a darker banner with the dot, the number and the time, the question below it, the options as rows and the answer in a band at the foot
const props = defineProps({row: {type: Object, required: true}, flush: Boolean});
const emit = defineEmits(["changed"]);
const context = useWindow();
const typed = ref("");
const settled = ref(null);
const refusal = ref("");
const elaborated = ref(false);

async function settle(change, words) {
    settled.value = change;
    refusal.value = "";
    const result = await context.run(words);
    if (result.ok) return void emit("changed");
    settled.value = null;
    refusal.value = result.error;
}

const shown = () => ({...props.row, ...settled.value});
const answer = (text) => settle({state: "answered", answer: text}, ["question", "answer", String(props.row.id), "--answer", text]);
const close = () => settle({state: "closed"}, ["question", "close", String(props.row.id)]);

function sendTyped() {
    const text = typed.value.trim();
    if (text) answer(text);
}

async function elaborate() {
    elaborated.value = true;
    const result = await context.run(["message", "send", `Elaborate on question ${props.row.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
    if (result.ok) return;
    elaborated.value = false;
    refusal.value = result.error;
}
</script>

<template>
    <section :class="['question', {flush}]" :data-state="shown().state" data-question-card>
        <header class="question-head">
            <template v-if="flush">
                <i class="question-dot" data-question-dot />
            </template>
            <p class="question-label">Question {{ row.id }}</p>
            <TimeAgo class="question-time" :at="row.created_at" data-question-time />
        </header>
        <button type="button" class="question-open" :data-question-open="row.id" @click="peekRef(`questions:${row.id}`)">{{ row.text }}</button>
        <template v-if="row.context">
            <p class="question-context" data-question-context>{{ row.context }}</p>
        </template>
        <template v-if="shown().state !== 'open'">
            <p class="question-closed" data-question-settled>
                <template v-if="shown().state === 'answered'"><template v-if="flush"><b class="question-answered">Answered:</b> <span class="question-answer">{{ shown().answer }}</span></template><template v-else>Answered: {{ shown().answer }}</template></template>
                <template v-else>Closed</template>
            </p>
        </template>
        <template v-else>
            <div class="question-options">
                <template v-for="option in row.options" :key="option">
                    <button type="button" :class="['question-option', {recommended: option === row.recommended}]" :data-question-option="option" @click="answer(option)">
                        <template v-if="flush">
                            <i class="question-ring" />
                        </template>
                        <template v-if="option === row.recommended && !flush">
                            <span class="question-tag">Recommended</span>
                        </template>
                        <span class="question-option-text">{{ option }}</span>
                        <template v-if="option === row.recommended && flush">
                            <span class="question-chip">Recommended</span>
                        </template>
                    </button>
                </template>
            </div>
            <form class="question-form" @submit.prevent="sendTyped">
                <template v-if="flush">
                    <TextInput v-model="typed" class="question-input" placeholder="Or answer in your own words…" />
                    <span class="question-buttons"><QuestionActions :elaborated="elaborated" @close="close" @elaborate="elaborate" @answer="sendTyped" /></span>
                </template>
                <template v-else>
                    <TextInput v-model="typed" placeholder="Or answer in your own words…">
                        <template #end><QuestionActions :elaborated="elaborated" @close="close" @elaborate="elaborate" @answer="sendTyped" /></template>
                    </TextInput>
                </template>
            </form>
        </template>
        <template v-if="refusal">
            <p class="question-failure" role="alert" data-question-failure>{{ refusal }}</p>
        </template>
    </section>
</template>

<style scoped>
.question {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 640px;
    margin-bottom: 10px;
    padding: 14px 16px 16px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    overflow-wrap: anywhere;
}

.question-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
}

.question-time {
    flex: none;
    color: var(--text-3);
    font-size: 11.5px;
}

.question-label {
    margin: 0;
    color: var(--text-3);
    font-size: 10.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.question-open {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 14.5px;
    font-weight: 600;
    line-height: 1.4;
    text-align: left;
    cursor: pointer;
}

.question-context {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-line;
}

.question-options {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.question-option {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 9px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition:
        transform 0.12s ease,
        border-color 0.2s ease;
}

.question-option:hover {
    border-color: var(--accent);
}

.question-option:active {
    transform: scale(0.98);
}

.question-option.recommended {
    border-color: color-mix(in srgb, var(--accent) 40%, var(--border-2));
}

.question-tag {
    margin: -9px -12px 8px;
    padding: 4px 12px;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    color: var(--accent-text);
    font-size: 11px;
}

.question-closed {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.question-failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

/* the questions window's block: edge to edge, a line above and below, the banner, the text, the options and the answer one under the other */
.question.flush {
    flex: none;
    gap: 0;
    max-width: none;
    margin: 0;
    padding: 0 14px;
    border: 0;
    border-top: 1px solid var(--border-2);
    border-bottom: 1px solid var(--border-2);
    border-radius: 0;
    background: var(--bg);
}

.flush .question-head {
    align-items: center;
    justify-content: flex-start;
    gap: 7px;
    margin: 0 -14px;
    padding: 8px 14px;
    border-bottom: 1px solid var(--border-inner);
    background: var(--bg-2);
}

.flush .question-label {
    font-size: 12px;
    white-space: nowrap;
    letter-spacing: 0;
    text-transform: none;
}

.flush .question-time {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
}

.question-dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
}

.flush[data-state="answered"] .question-dot {
    background: var(--tone-good, var(--green));
}

.flush[data-state="closed"] .question-dot {
    background: var(--text-3);
}

.flush .question-open {
    padding: 12px 0;
    font-size: 14px;
    line-height: 1.45;
}

.flush .question-context {
    margin-top: -4px;
    padding-bottom: 12px;
}

.flush .question-open:hover {
    color: var(--accent-text);
}

.flush .question-options {
    gap: 0;
    margin: 0 -14px;
    border-top: 1px solid var(--border-inner);
}

.flush .question-option {
    flex-direction: row;
    align-items: flex-start;
    gap: 10px;
    overflow: visible;
    width: 100%;
    padding: 9px 14px;
    border: 0;
    border-bottom: 1px solid var(--border-inner);
    border-radius: 0;
    background: none;
    line-height: 1.5;
    transition: none;
}

.flush .question-option:last-child {
    border-bottom: 0;
}

.flush .question-option:hover {
    background: var(--hover);
}

.flush .question-option:active {
    transform: none;
}

.question-ring {
    flex: none;
    width: 14px;
    height: 14px;
    margin-top: 2px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
}

.flush .question-option:hover .question-ring,
.flush .question-option.recommended .question-ring {
    border-color: var(--accent);
}

.question-option-text {
    flex: 1;
    min-width: 0;
}

.question-chip {
    flex: none;
    margin-top: 1px;
    padding: 1px 8px;
    border-radius: 999px;
    background: var(--accent-dim);
    color: var(--accent-text);
    font-size: 11px;
    white-space: nowrap;
}

.flush .question-closed {
    display: flex;
    gap: 9px;
    margin: 0 -14px;
    padding: 10px 14px;
    border-top: 1px solid var(--border-inner);
    background: var(--side);
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.flush .question-closed::before {
    content: "";
    flex: none;
    width: 7px;
    height: 7px;
    margin-top: 6px;
    border-radius: 50%;
    background: var(--text-3);
}

.flush[data-state="answered"] .question-closed::before {
    background: var(--tone-good, var(--green));
}

.flush .question-answered {
    flex: none;
    color: var(--text);
    font-weight: 500;
    white-space: nowrap;
}

.flush .question-answer {
    flex: 1;
    min-width: 0;
}

.flush .question-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin: 0 -14px;
    padding: 8px 14px;
    border-top: 1px solid var(--border-inner);
    background: var(--side);
}

.flush .question-input {
    flex: 1 1 220px;
}

.question-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.flush .question-failure {
    padding: 0 0 10px;
}
</style>
