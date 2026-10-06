<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {peek} from "../route.js";
import Btn from "../kit/Btn.vue";
import AgentStrip from "../agents/AgentStrip.vue";
import NewResource from "../resource/NewResource.vue";
import BoardLanes from "./BoardLanes.vue";
import BoardStrips from "./BoardStrips.vue";
import ShiftPrompt from "./ShiftPrompt.vue";
import {useBoardShift} from "./boardShift.js";
import {lens, named, visibleLanes} from "./lanes.js";

const props = defineProps({
    text: {type: String, default: ""},
    refusal: {type: String, default: ""},
    refresh: {type: Function, required: true},
    refuse: {type: Function, required: true},
    notify: {type: Function, required: true},
});
const MEANINGS = {doing: "start", asked: "review", done: "done"};
const ASKS = {held: true, done: true};
const adding = ref("");
const asking = ref(null);
const plans = computed(() => rows("plan").filter((plan) => !plan.completed && !plan.deleted));
const chosenPlan = computed(() => store.board.lens.plan);
const meaningOf = (key) => MEANINGS[key] || "";
const lanes = computed(() => visibleLanes(meaningOf, named(props.text)));
const empty = computed(() => store.board.loaded && lanes.value.every((lane) => !lane.cards.length));
const newWork = () => (adding.value = "todo");
const {moving, shift} = useBoardShift({
    send: (card, lane, words) => api.shift(card.n, lane, words),
    move,
    refresh: () => props.refresh(),
    refuse: (e) => props.refuse(e),
    notify: (toast) => props.notify(toast),
});

function move(card, lane) {
    if (card.type === "todo" && (ASKS[lane] || (card.lane === "done" && lane === "todo"))) asking.value = {card, lane};
    else return shift(card, lane);
    return null;
}

function answer(words) {
    const {card, lane} = asking.value;
    asking.value = null;
    shift(card, lane, words);
}

function made(n) {
    peek(adding.value, n);
    adding.value = "";
}

defineExpose({newWork, writing: computed(() => Boolean(adding.value))});
</script>

<template>
    <template v-if="empty">
        <div class="empty">
            <p>Nothing is on the list.</p>
            <Btn kind="primary" small @click="newWork">New to-do</Btn>
        </div>
    </template>
    <template v-else>
        <div class="plans">
            <Btn :class="['plan', {on: !chosenPlan}]" @click="lens({plan: 0})">All to-dos</Btn>
            <template v-for="plan in plans" :key="plan.n">
                <Btn :class="['plan', {on: chosenPlan === plan.n}]" @click="lens({plan: plan.n})">Plan {{ plan.n }}</Btn>
            </template>
            <span class="grow" />
            <AgentStrip />
        </div>
        <BoardStrips :refusal="refusal" :hold="store.board.planHold || ''" />
        <BoardLanes :lanes="lanes" :meaning-of="meaningOf" :move="move" :moving="moving" :refresh="refresh" :new-work="newWork" />
    </template>
    <template v-if="asking">
        <ShiftPrompt :ask="asking" @send="answer" @close="asking = null" />
    </template>
    <template v-if="adding">
        <NewResource :type="adding" @made="made" @close="adding = ''" />
    </template>
</template>

<style scoped>
.plans {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    min-height: 44px;
    padding: 6px 12px 6px 20px;
    border-bottom: 1px solid var(--border);
}

.plan {
    padding: 4px 9px;
    border: 1px solid var(--border);
    border-radius: 99px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.plan.on {
    border-color: var(--accent);
    color: var(--text);
}

.grow {
    flex: 1;
    min-width: 8px;
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 18px 20px;
}

.empty p {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
}

@media (max-width: 640px) {
    .plans {
        padding: 6px 14px;
    }

    .grow {
        display: none;
    }
}
</style>
