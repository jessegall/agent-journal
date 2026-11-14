<script setup>
import {computed, ref} from "vue";
import {ActionsMenu, AgentBadge, Btn, TextInput, peekRef, useWindow, vContext} from "@journal/window-kit";
import {askerOf, clockOf, planOf, questionMenu} from "./questionWords.js";

// one question of the Questions window: the number, the asking agent as a chip, the plan as a link, More and the clock time in its head; the question, its context, the options as
// plain rows with a star after the recommended one, then Other and Answer. Picking selects, Answer sends, typing clears the pick; a done card shows its answer in quiet colours
const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["changed"]);
const view = useWindow();
const picked = ref("");
const typed = ref("");
const settled = ref(null);
const refusal = ref("");
const elaborated = ref(false);
const shown = computed(() => ({...props.row, ...settled.value}));
const chosen = computed(() => typed.value.trim() || picked.value);
const plan = planOf(props.row);

async function settle(change, line) {
    settled.value = change;
    refusal.value = "";
    const answer = await view.run(line);
    if (answer.ok) return void emit("changed");
    settled.value = null;
    refusal.value = answer.error;
}
const send = () => chosen.value && settle({state: "answered", answer: chosen.value}, ["question", "answer", String(props.row.id), "--answer", chosen.value]);
const close = () => settle({state: "closed"}, ["question", "close", String(props.row.id)]);
async function elaborate() {
    elaborated.value = true;
    const answer = await view.run(["message", "send", `Elaborate on question ${props.row.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
    if (answer.ok) return;
    elaborated.value = false;
    refusal.value = answer.error;
}
const items = () => questionMenu(props.row, {elaborate, close, elaborated: elaborated.value});
const pick = (option) => {
    picked.value = option;
    typed.value = "";
};
</script>

<template>
    <section v-context="() => ({head: `Question ${row.id}`, items: items()})" :class="['card', {done: shown.state !== 'open'}]" :data-state="shown.state" data-question-card>
        <header class="head">
            <button type="button" class="number" :title="`Question ${row.id}`" :data-question-open="row.id" @click="peekRef(`questions:${row.id}`)">{{ row.id }}</button>
            <AgentBadge :name="askerOf(row)" chip data-question-agent />
            <template v-if="plan">
              <button type="button" class="plan" data-question-plan @click="peekRef(`plans:${plan}`)">Plan {{ plan }}</button>
            </template>
            <span class="grow" />
            <template v-if="shown.state === 'open'">
              <ActionsMenu :items="items()" :head="`Question ${row.id}`" label="More" />
            </template>
            <time class="time" :datetime="row.created_at" data-question-time>{{ clockOf(row.created_at) }}</time>
        </header>
        <p class="text">{{ row.text }}</p>
        <template v-if="shown.state !== 'open'">
            <p class="settled" data-question-settled>{{ shown.state === "answered" ? shown.answer : "Closed" }}</p>
        </template>
        <template v-else>
            <template v-if="row.context">
              <p class="context" data-question-context>{{ row.context }}</p>
            </template>
            <div class="options" role="radiogroup" aria-label="Options">
                <template v-for="option in row.options" :key="option">
                    <button type="button" role="radio" class="option" :aria-checked="picked === option && !typed.trim()" :data-question-option="option" @click="pick(option)">
                        <i class="ring" />
                        <span class="option-text">{{ option }}</span>
                        <template v-if="option === row.recommended">
                          <span class="star" aria-label="Recommended" data-question-recommended>★</span>
                        </template>
                    </button>
                </template>
            </div>
            <form class="form" @submit.prevent="send">
                <TextInput v-model="typed" placeholder="Other" aria-label="Other answer" />
                <Btn variant="primary" small type="submit" data-question-answer :disabled="!chosen">Answer</Btn>
            </form>
        </template>
        <template v-if="refusal">
          <p class="failure" role="alert" data-question-failure>{{ refusal }}</p>
        </template>
    </section>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px 14px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    overflow-wrap: anywhere;
}

.head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.grow {
    flex: 1;
}

.number,
.plan {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.number {
    font-weight: 600;
}

.time {
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

.text {
    margin: 0;
    color: var(--text);
    font-size: 13.5px;
    font-weight: 500;
}

.context,
.settled {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.done .text {
    color: var(--text-2);
}

.options {
    display: flex;
    flex-direction: column;
}

.option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.ring {
    width: 12px;
    height: 12px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
}

.option[aria-checked="true"] .ring {
    border-color: var(--accent);
    background: var(--accent);
    box-shadow: inset 0 0 0 2px var(--raised);
}

.star {
    color: var(--accent-text);
    font-size: 11px;
}

.form {
    display: flex;
    gap: 8px;
}

.form :deep(input) {
    flex: 1;
}

.failure {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}
</style>
