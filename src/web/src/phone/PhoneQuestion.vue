<script setup>
import {computed, inject, nextTick, ref} from "vue";
import {useHeldSend} from "../composables/heldSend.js";
import {ended, perform} from "./outbox.js";
import {phone} from "../api/phone.js";
import PhoneSending from "./PhoneSending.vue";
import Btn from "../kit/Btn.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {ago} from "../format/time.js";
import {announce, HELD, tell, tryAgain} from "./announce.js";
import {tick} from "./haptic.js";

const card = ref(null);
const props = defineProps({question: {type: Object, required: true}});
const emit = defineEmits(["done"]);
const failed = inject("phoneFailed");
const refresh = inject("phoneRefresh", () => {});
const typed = ref(false);
const OWN = "own-words";
const rows = computed(() => [
    ...options.value.map((option) => ({
        key: `option-${option.title}`,
        title: option.title,
        sending: choice.value === option.title && !typed.value,
    })),
    {key: OWN, own: true, sending: Boolean(choice.value) && typed.value},
]);
const own = ref("");
const answered = ref("");
const trouble = ref("");
const options = computed(() => props.question.data.options || []);
const outcome = computed(() =>
    props.question.data.dismissed || answered.value === "Dismissed" ? "Dismissed" : `Answered: ${props.question.outcome || answered.value}`
);
const {
    left,
    length: seconds,
    value: held,
    start,
    undo,
    sendNow,
} = useHeldSend({seconds: () => props.question.hold, send, sendOnUnmount: true, sendWhenHidden: true});
const choice = computed(() => held.value ?? "");

function stop() {
    undo();
    typed.value = false;
}

function pickOwn() {
    const words = own.value.trim();
    if (!words) return;
    typed.value = true;
    pick(words);
}

async function send(answer) {
    stop();
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
    stop();
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

function pick(answer) {
    if (answered.value) return;
    tick();
    if (choice.value === answer) return sendNow();
    start(answer);
    nextTick(() => card.value?.querySelector(".sending-undo")?.focus({preventScroll: true}));
}
</script>

<template>
    <article ref="card" class="question">
        <span class="question-kind">Question · {{ ago(question.created) }}</span>
        <p class="question-title">{{ question.title }}</p>
        <template v-if="question.abstract">
            <TextDisplay class="question-abstract" :text="question.abstract" />
        </template>
        <template v-if="question.completed || answered">
            <p class="question-answer">{{ outcome }}</p>
        </template>
        <template v-else>
            <div class="question-options">
                <template v-for="row in rows" :key="row.key">
                    <template v-if="row.sending">
                        <PhoneSending :answer="choice" :left="left" :seconds="seconds" @now="sendNow" @undo="stop" />
                    </template>
                    <template v-else-if="row.own">
                        <form class="question-own" @submit.prevent="pickOwn">
                            <label class="phone-hidden" :for="`own-${question.n}`">Your own answer</label>
                            <input
                                :id="`own-${question.n}`"
                                v-model="own"
                                class="question-words"
                                placeholder="Or answer in your own words"
                            />
                            <Btn large @click="pickOwn">Answer</Btn>
                        </form>
                    </template>
                    <template v-else>
                        <Btn large @click="pick(row.title)">{{ row.title }}</Btn>
                    </template>
                </template>
            </div>
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

.question-options {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.question :deep(.btn),
.question :deep(button) {
    font-size: 1em;
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
