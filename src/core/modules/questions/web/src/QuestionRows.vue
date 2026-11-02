<script setup>
import {ref} from "vue";
import {Btn, RowList, TextInput, ago, useListTools, ListTools, useRows, peekRef} from "@journal/window-kit";

// the questions as version 4 asked them: a card with the options under each other, the recommended one tagged, and a box for an answer in the person's own words;
// an answer shows the moment it is given and goes back if the server refuses it
const {rows, failure, loaded, load, context} = useRows("question list --all", ["question.*"]);
const tools = useListTools(rows, {title: (row) => row.text, isOpen: (row) => row.state === "open"});
const typed = ref({});
const settled = ref({});
const refusals = ref({});
const elaborated = ref(new Set());

const shown = (row) => ({...row, ...settled.value[row.id]});

async function settle(row, change, words) {
    settled.value = {...settled.value, [row.id]: change};
    refusals.value = {...refusals.value, [row.id]: ""};
    const result = await context.run(words);
    if (result.ok) return void load();
    settled.value = Object.fromEntries(Object.entries(settled.value).filter(([id]) => Number(id) !== row.id));
    refusals.value = {...refusals.value, [row.id]: result.error};
}

const answer = (row, text) => settle(row, {state: "answered", answer: text}, ["question", "answer", String(row.id), "--answer", text]);
const close = (row) => settle(row, {state: "closed"}, ["question", "close", String(row.id)]);

function sendTyped(row) {
    const text = (typed.value[row.id] || "").trim();
    if (text) answer(row, text);
}

async function elaborate(row) {
    elaborated.value = new Set([...elaborated.value, row.id]);
    const result = await context.run(["message", "send", `Elaborate on question ${row.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
    if (result.ok) return;
    elaborated.value = new Set([...elaborated.value].filter((id) => id !== row.id));
    refusals.value = {...refusals.value, [row.id]: result.error};
}
</script>

<template>
    <div class="questions">
        <ListTools :tools="tools" placeholder="Search the questions" />
        <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No open questions">
            <template #default="{row}">
                <section class="question" :data-state="shown(row).state">
                    <header class="question-head">
                        <p class="question-label">Question {{ row.id }}</p>
                        <time class="question-time" :datetime="row.created_at" :title="new Date(row.created_at).toLocaleString()" data-question-time>{{ ago(row.created_at) }}</time>
                    </header>
                    <button type="button" class="question-open" :data-question-open="row.id" @click="peekRef(`questions:${row.id}`)">{{ row.text }}</button>
                    <template v-if="shown(row).state !== 'open'">
                        <p class="question-closed" data-question-settled>{{ shown(row).state === "answered" ? `Answered: ${shown(row).answer}` : "Closed" }}</p>
                    </template>
                    <template v-else>
                        <div class="question-options">
                            <template v-for="option in row.options" :key="option">
                                <button type="button" :class="['question-option', {recommended: option === row.recommended}]" :data-question-option="option" @click="answer(row, option)">
                                    <template v-if="option === row.recommended">
                                        <span class="question-tag">Recommended</span>
                                    </template>
                                    <span>{{ option }}</span>
                                </button>
                            </template>
                        </div>
                        <form @submit.prevent="sendTyped(row)">
                            <TextInput v-model="typed[row.id]" placeholder="Or answer in your own words…">
                                <template #end>
                                    <Btn small data-question-close @click="close(row)">Close</Btn>
                                    <Btn small :disabled="elaborated.has(row.id)" data-question-elaborate @click="elaborate(row)">{{ elaborated.has(row.id) ? "Asked to elaborate" : "Elaborate" }}</Btn>
                                    <Btn kind="primary" small data-question-answer @click="sendTyped(row)">Answer</Btn>
                                </template>
                            </TextInput>
                        </form>
                    </template>
                    <template v-if="refusals[row.id]">
                        <p class="question-failure" role="alert" data-question-failure>{{ refusals[row.id] }}</p>
                    </template>
                </section>
            </template>
        </RowList>
    </div>
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
