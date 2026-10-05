<script setup>
import {computed, inject, ref} from "vue";
import {ended, perform} from "./outbox.js";
import {phone} from "../api/phone.js";
import PhoneSending from "./PhoneSending.vue";
import Btn from "../kit/Btn.vue";
import OptionList from "../kit/OptionList.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {ago} from "../format/time.js";
import {announce, HELD, tell, tryAgain} from "./announce.js";

const props = defineProps({question: {type: Object, required: true}});
const emit = defineEmits(["done"]);
const failed = inject("phoneFailed");
const refresh = inject("phoneRefresh", () => {});
const list = ref(null);
const own = ref("");
const answered = ref("");
const trouble = ref("");
const options = computed(() => props.question.data.options || []);
const outcome = computed(() =>
    props.question.data.dismissed || answered.value === "Dismissed" ? "Dismissed" : `Answered: ${props.question.outcome || answered.value}`
);

function holdOwn(hold) {
    const words = own.value.trim();
    if (!words) return;
    hold(words);
}

async function send(answer) {
    trouble.value = "";
    answered.value = answer;
    try {
        const went = await perform({kind: "answer", n: props.question.n, answer});
        if (went === "held") tell(trouble, HELD);
        else announce("Answer sent");
        refresh();
        if (went !== "held") emit("done");
    } catch (error) {
        missed(error, answer);
    }
}

async function reconciled(mine) {
    refresh();
    try {
        const real = await phone.row(`question:${props.question.n}`);
        const theirs = real.data?.dismissed ? "Dismissed" : real.outcome || "";
        if (!theirs) return;
        answered.value = theirs;
        if (theirs !== mine) tell(trouble, `Already answered on the computer: ${theirs}`);
    } catch (error) {
        if (ended(error)) failed(error);
    }
}

function missed(error, mine) {
    if (error.status === 409) return reconciled(mine);
    answered.value = "";
    if (ended(error)) failed(error);
    else tell(trouble, tryAgain(error));
}

async function dismiss() {
    list.value?.undo();
    answered.value = "Dismissed";
    try {
        const went = await perform({kind: "dismiss", n: props.question.n});
        if (went === "held") tell(trouble, HELD);
        else announce("Question dismissed");
        refresh();
        if (went !== "held") emit("done");
    } catch (error) {
        missed(error, "Dismissed");
    }
}
</script>

<template>
    <article class="question">
        <span class="question-kind">Question · {{ ago(question.created) }}</span>
        <p class="question-title">{{ question.title }}</p>
        <template v-if="question.abstract">
            <TextDisplay class="question-abstract" :text="question.abstract" />
        </template>
        <template v-if="question.completed || answered">
            <p class="question-answer">{{ outcome }}</p>
        </template>
        <template v-else>
            <OptionList ref="list" :options="options" :send="send" :hold-seconds="question.hold" large send-when-hidden>
                <template #held="{answer, left, seconds, sendNow, undo}">
                    <PhoneSending :answer="answer" :left="left" :seconds="seconds" @now="sendNow" @undo="undo" />
                </template>
                <template #own="{hold}">
                    <form class="question-own" @submit.prevent="holdOwn(hold)">
                        <label class="phone-hidden" :for="`own-${question.n}`">Your own answer</label>
                        <input :id="`own-${question.n}`" v-model="own" class="question-words" placeholder="Or answer in your own words" />
                        <Btn large @click="holdOwn(hold)">Answer</Btn>
                    </form>
                </template>
            </OptionList>
            <button type="button" class="question-dismiss" @click="dismiss">Dismiss</button>
            <template v-if="trouble">
                <p class="question-trouble">{{ trouble }}</p>
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
    font-size: 0.735em;
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

.question :deep(.btn),
.question :deep(button) {
    font-size: 1em;
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
    font-size: max(16px, 1em);
}

.question-dismiss {
    align-self: flex-start;
    min-height: 44px;
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 0.824em;
}

.question-trouble {
    margin: 0;
    color: var(--danger);
    font-size: 0.824em;
}

.question-answer {
    margin: 0;
    color: var(--tone-good);
}
</style>
