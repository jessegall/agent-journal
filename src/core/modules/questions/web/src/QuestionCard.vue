<script setup>
import {ref} from "vue";
import {Btn, TextInput, ago, peekRef, useWindow} from "@journal/window-kit";

// one question as version 4 asked it: a card with the options under each other, the recommended one tagged, and a box for an answer in the person's own words;
// an answer shows the moment it is given and goes back if the server refuses it
const props = defineProps({row: {type: Object, required: true}});
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
    <section class="question" :data-state="shown().state" data-question-card>
        <header class="question-head">
            <p class="question-label">Question {{ row.id }}</p>
            <time class="question-time" :datetime="row.created_at" :title="new Date(row.created_at).toLocaleString()" data-question-time>{{ ago(row.created_at) }}</time>
        </header>
        <button type="button" class="question-open" :data-question-open="row.id" @click="peekRef(`questions:${row.id}`)">{{ row.text }}</button>
        <template v-if="shown().state !== 'open'">
            <p class="question-closed" data-question-settled>{{ shown().state === "answered" ? `Answered: ${shown().answer}` : "Closed" }}</p>
        </template>
        <template v-else>
            <div class="question-options">
                <template v-for="option in row.options" :key="option">
                    <button type="button" :class="['question-option', {recommended: option === row.recommended}]" :data-question-option="option" @click="answer(option)">
                        <template v-if="option === row.recommended">
                            <span class="question-tag">Recommended</span>
                        </template>
                        <span>{{ option }}</span>
                    </button>
                </template>
            </div>
            <form @submit.prevent="sendTyped">
                <TextInput v-model="typed" placeholder="Or answer in your own words…">
                    <template #end>
                        <Btn small data-question-close @click="close">Close</Btn>
                        <Btn small :disabled="elaborated" data-question-elaborate @click="elaborate">{{ elaborated ? "Asked to elaborate" : "Elaborate" }}</Btn>
                        <Btn kind="primary" small data-question-answer @click="sendTyped">Answer</Btn>
                    </template>
                </TextInput>
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
</style>
