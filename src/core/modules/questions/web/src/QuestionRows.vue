<script setup>
import {ref} from "vue";
import {RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded, load, context} = useRows("question list", ["question.*"]);
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
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No open questions">
            <template #default="{row}">
                <div class="question">
                    <p class="question-text">{{ row.text }}</p>
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
                </div>
            </template>
        </RowList>
        <template v-if="runFailure">
            <p class="question-failure">{{ runFailure }}</p>
        </template>
    </div>
</template>

<style scoped>
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
</style>
