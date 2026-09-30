<script setup>
import {computed, inject, onUnmounted, ref} from "vue";
import {phone} from "../api/phone.js";
import Btn from "../kit/Btn.vue";
import TextDisplay from "../kit/TextDisplay.vue";

const UNDO_SECONDS = 5;
const props = defineProps({question: {type: Object, required: true}});
const failed = inject("phoneFailed");
const refresh = inject("phoneRefresh", () => {});
const choice = ref("");
const left = ref(0);
const own = ref("");
const said = ref("");
const options = computed(() => props.question.data.options || []);
let timer = 0;

function stop() {
    clearInterval(timer);
    choice.value = "";
}

async function send(answer) {
    stop();
    said.value = answer;
    try {
        await phone.answer(props.question.n, answer);
        refresh();
    } catch (error) {
        if (error.status !== 409) {
            said.value = "";
            failed(error);
        }
    }
}

function pick(answer) {
    if (choice.value || said.value) return;
    choice.value = answer;
    left.value = UNDO_SECONDS;
    timer = setInterval(() => (left.value -= 1) <= 0 && send(answer), 1000);
}

onUnmounted(() => clearInterval(timer));
</script>

<template>
    <article class="question">
        <span class="question-kind">Question</span>
        <p class="question-title">{{ question.title }}</p>
        <template v-if="question.abstract">
            <TextDisplay class="question-abstract" :text="question.abstract" />
        </template>
        <template v-if="question.completed || said">
            <p class="question-answer">Answered: {{ question.outcome || said }}</p>
        </template>
        <template v-else-if="choice">
            <div class="question-held">
                <span>Sending "{{ choice }}" in {{ left }}s</span>
                <Btn large @click="stop">Undo</Btn>
            </div>
        </template>
        <template v-else>
            <div class="question-options">
                <template v-for="option in options" :key="option.title">
                    <Btn large @click="pick(option.title)">{{ option.title }}</Btn>
                </template>
            </div>
            <form class="question-own" @submit.prevent="own.trim() && send(own.trim())">
                <input v-model="own" class="question-words" placeholder="Or answer in your own words" />
                <Btn large @click="own.trim() && send(own.trim())">Answer</Btn>
            </form>
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
    font-size: 12.5px;
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
    border-radius: 10px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
}

.question-held {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--text-2);
}

.question-answer {
    margin: 0;
    color: var(--tone-good);
}
</style>
