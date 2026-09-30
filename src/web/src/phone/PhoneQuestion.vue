<script setup>
import {computed, inject, nextTick, onUnmounted, ref} from "vue";
import {ended, perform} from "./outbox.js";
import Btn from "../kit/Btn.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {ago} from "./ago.js";
import {announce} from "./announce.js";
import {tick} from "./haptic.js";

const UNDO_SECONDS = 5;
const undo = ref(null);
const HELD = "No connection right now: this goes as soon as the phone reaches your computer again.";
const props = defineProps({question: {type: Object, required: true}});
const emit = defineEmits(["done"]);
const failed = inject("phoneFailed");
const refresh = inject("phoneRefresh", () => {});
const choice = ref("");
const left = ref(0);
const own = ref("");
const said = ref("");
const trouble = ref("");
const options = computed(() => props.question.data.options || []);
const outcome = computed(() =>
    props.question.data.dismissed || said.value === "Dismissed" ? "Dismissed" : `Answered: ${props.question.outcome || said.value}`
);
let timer = 0;

function stop() {
    clearInterval(timer);
    choice.value = "";
}

async function send(answer) {
    stop();
    trouble.value = "";
    said.value = answer;
    try {
        const went = await perform({kind: "answer", n: props.question.n, answer});
        if (went === "held") trouble.value = HELD;
        announce(went === "held" ? "Answer waits to send" : "Answer sent");
        refresh();
        emit("done");
    } catch (error) {
        missed(error);
    }
}

function missed(error) {
    if (error.status === 409) return;
    said.value = "";
    if (ended(error)) failed(error);
    else trouble.value = `That didn't go through: ${error.message}. Try again.`;
}

async function dismiss() {
    stop();
    said.value = "Dismissed";
    try {
        if ((await perform({kind: "dismiss", n: props.question.n})) === "held") trouble.value = HELD;
        announce("Question dismissed");
        refresh();
        emit("done");
    } catch (error) {
        missed(error);
    }
}

function pick(answer) {
    if (said.value) return;
    tick();
    if (choice.value === answer) return send(answer);
    clearInterval(timer);
    choice.value = answer;
    left.value = UNDO_SECONDS;
    nextTick(() => undo.value?.$el?.focus());
    timer = setInterval(() => (left.value -= 1) <= 0 && send(answer), 1000);
}

onUnmounted(() => clearInterval(timer));
</script>

<template>
    <article class="question">
        <span class="question-kind">Question · {{ ago(question.created) }}</span>
        <p class="question-title">{{ question.title }}</p>
        <template v-if="question.abstract">
            <TextDisplay class="question-abstract" :text="question.abstract" />
        </template>
        <template v-if="question.completed || said">
            <p class="question-answer">{{ outcome }}</p>
        </template>
        <template v-else>
            <template v-if="choice">
                <div class="question-held">
                    <span>Sending "{{ choice }}" in {{ left }}s</span>
                    <Btn kind="primary" large @click="send(choice)">Send now</Btn>
                    <Btn ref="undo" large :aria-label="`Undo. Sending &quot;${choice}&quot; in ${UNDO_SECONDS} seconds`" @click="stop">Undo</Btn>
                </div>
            </template>
            <div class="question-options">
                <template v-for="option in options" :key="option.title">
                    <Btn :kind="choice === option.title ? 'primary' : ''" large @click="pick(option.title)">{{ option.title }}</Btn>
                </template>
            </div>
            <form class="question-own" @submit.prevent="own.trim() && send(own.trim())">
                <input v-model="own" class="question-words" placeholder="Or answer in your own words" />
                <Btn large @click="own.trim() && send(own.trim())">Answer</Btn>
            </form>
            <button type="button" class="question-dismiss" @click="dismiss">Dismiss</button>
            <template v-if="trouble">
                <p class="question-trouble" role="status">{{ trouble }}</p>
            </template>
        </template>
    </article>
</template>

<style scoped>
.question {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
}

.question-kind {
    color: var(--accent-text);
    font-size: 0.735rem;
    font-weight: 600;
}

.question-title {
    margin: 0;
    font-weight: 600;
    line-height: 1.4;
}

.question-abstract {
    color: var(--text-2);
}

.question-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.question-options .btn {
    justify-content: flex-start;
    white-space: normal;
    text-align: left;
}

.question-own {
    display: flex;
    gap: 8px;
}

.question-words {
    flex: 1;
    min-width: 0;
    min-height: 44px;
    padding: 0 12px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: max(16px, 1rem);
}

.question-held {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    color: var(--text-2);
}

.question-held span {
    flex: 1 1 100%;
}

.question-dismiss {
    align-self: flex-start;
    min-height: 44px;
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 0.824rem;
}

.question-trouble {
    margin: 0;
    color: var(--danger);
    font-size: 0.824rem;
}

.question-answer {
    margin: 0;
    color: var(--tone-good);
}
</style>
