<script setup>
import {ref} from "vue";
import {RowList, useListTools, ListTools, useRows, peekRef} from "@journal/window-kit";

const {rows, failure, loaded, load, context} = useRows("question list", ["question.*"]);
const tools = useListTools(rows, {title: (row) => row.text, isOpen: (row) => row.state === "open"});
const typed = ref({});
const runFailure = ref("");

async function run(words) {
    const result = await context.run(words);
    runFailure.value = result.ok ? "" : result.error;
    load();
}

function answer(row, text) {
    return run(["question", "answer", String(row.id), "--answer", text]);
}

function sendTyped(row) {
    const text = (typed.value[row.id] || "").trim();
    if (text) answer(row, text).then(() => (typed.value[row.id] = ""));
}

function choiceLabel(row, option) {
    return option === row.recommended ? `${option} (recommended)` : option;
}
</script>

<template>
    <div class="questions">
        <ListTools :tools="tools" placeholder="Search the questions" />
        <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No open questions">
            <template #default="{row}">
                <div class="question" :data-state="row.state">
                    <p class="question-text"><button type="button" class="question-open" :data-question-open="row.id" @click="peekRef(`questions:${row.id}`)">{{ row.text }}</button></p>
                    <template v-if="row.state !== 'open'">
                        <p class="question-closed">{{ row.state === "answered" ? `Answered: ${row.answer}` : "Closed" }}</p>
                    </template>
                    <template v-if="row.state === 'open'">
                        <div class="question-choices">
                            <template v-for="option in row.options" :key="option">
                                <button type="button" :class="['question-choice', {recommended: option === row.recommended}]" @click="answer(row, option)">
                                    {{ choiceLabel(row, option) }}
                                </button>
                            </template>
                        </div>
                        <form class="question-form" @submit.prevent="sendTyped(row)">
                            <input v-model="typed[row.id]" class="question-answer" placeholder="Answer in your own words" />
                            <button type="button" class="question-send" @click="sendTyped(row)">Answer</button>
                            <button type="button" class="question-close" @click="run(['question', 'close', String(row.id)])">Close</button>
                        </form>
                    </template>
                </div>
            </template>
        </RowList>
        <template v-if="runFailure">
            <p class="question-failure">{{ runFailure }}</p>
        </template>
    </div>
</template>

<style scoped>
.question-open {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.question {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
}

.question-text {
    margin: 0;
}

.question-choices,
.question-form {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.question-answer {
    flex: 1;
    min-width: 120px;
}

.question-choice.recommended {
    font-weight: 600;
}

.question-failure {
    margin: 6px 8px 0;
    color: var(--text-2);
}
.question-closed {
    margin: 2px 0 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
