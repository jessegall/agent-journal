<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import ProofIcon from "./ProofIcon.vue";
import {useToggledSet} from "../composables/toggledSet.js";
import {isCheckable, pointRows, PROOF_WORDS, proofState} from "../domain/workerTurn.js";

const props = defineProps({task: {type: Object, required: true}, worker: {type: Number, required: true}, api: {type: Object, required: true}, checking: Boolean});
const points = computed(() => pointRows(props.task));
const writing = ref(0);
const shortfall = ref("");
const refusal = ref("");

async function act(name, body) {
    refusal.value = "";
    try {
        await props.api.act("workers", props.worker, name, body);
        writing.value = 0;
        shortfall.value = "";
    } catch (e) {
        refusal.value = e.message;
    }
}

// the points whose proof is shown: the ones opened, and on their own the ones a check waits on
const {members: opened, toggle: flip} = useToggledSet();
const waits = (row) => props.checking && isCheckable(row.proof);
const shown = (row) => opened.value.has(row.point) || waits(row);

const check = (point) => act("check", {point});
const sendBack = (point) => act("short_check", {point, shortfall: shortfall.value});
</script>

<template>
    <div class="points">
        <template v-for="row in points" :key="row.point">
            <div :class="['point', {open: shown(row)}]" @click="$event.target.closest('button, form') || flip(row.point)">
                <ProofIcon :state="proofState(row.proof)" />
                <span class="num">{{ row.point }}</span>
                <span class="wording">{{ row.wording }}</span>
                <span class="word">{{ PROOF_WORDS[proofState(row.proof)] }}</span>
                <template v-if="row.proof && shown(row)">
                    <div class="under">Proof: {{ row.proof.text }}</div>
                </template>
                <template v-if="row.proof && row.proof.shortfall">
                    <div class="reason">
                        <span class="label">Reason</span>
                        <p class="text">{{ row.proof.shortfall }}</p>
                    </div>
                </template>
                <template v-if="waits(row)">
                    <div class="acts">
                        <Btn small @click="check(row.point)">Check</Btn>
                        <Btn small @click="writing = row.point">Send back</Btn>
                    </div>
                    <template v-if="writing === row.point">
                        <form class="send-back" @submit.prevent="sendBack(row.point)">
                            <input v-model="shortfall" placeholder="What is missing" />
                            <Btn small kind="primary" :disabled="!shortfall.trim()" @click="sendBack(row.point)">Send it back</Btn>
                        </form>
                    </template>
                </template>
            </div>
        </template>
        <template v-if="refusal">
            <p class="refusal">{{ refusal }}</p>
        </template>
    </div>
</template>

<style scoped>
.points {
    display: flex;
    flex-direction: column;
    padding-bottom: 8px;
}

.point {
    display: grid;
    grid-template-columns: 14px 18px minmax(0, 1fr) auto;
    column-gap: 10px;
    align-items: start;
    padding: 9px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.12s ease;
}

.point:hover {
    background: var(--hover);
}

.num {
    padding-top: 1px;
    color: var(--text-4);
    font: 11.5px var(--mono);
}

.wording {
    min-width: 0;
    color: var(--text);
    text-wrap: pretty;
}

.word {
    padding-top: 1px;
    color: var(--text-4);
    font-size: 12px;
    white-space: nowrap;
}

.under {
    grid-column: 3 / -1;
    margin-top: 4px;
    color: var(--text-3);
    font-size: 12px;
    overflow-wrap: anywhere;
    text-wrap: pretty;
}

.reason {
    display: flex;
    grid-column: 3 / -1;
    flex-direction: column;
    gap: 2px;
    margin-top: 8px;
    padding-left: 12px;
    border-left: 2px solid var(--tone-warn);
}

.label {
    color: var(--text-4);
    font-size: 11.5px;
}

.text {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    text-wrap: pretty;
}

.acts,
.send-back {
    display: flex;
    grid-column: 3 / -1;
    gap: 4px;
    margin-top: 8px;
}

.send-back input {
    flex: 1 1 auto;
    min-width: 0;
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12px;
}

.refusal {
    margin: 6px 16px;
    color: var(--danger);
    font-size: 12px;
}
</style>
