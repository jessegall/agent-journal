<script setup>
import {computed, provide, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Lane from "../board/Lane.vue";
import ShiftPrompt from "../board/ShiftPrompt.vue";
import NewResource from "../resource/NewResource.vue";
import {usePoll} from "../poll.js";
import {peek, route} from "../route.js";
import {boardOn, store} from "../state/store.js";

const SKELETON = ["To do", "Held", "Doing", "Needs you", "Done"].map((title) => ({key: title, title, cards: []}));
const adding = ref(false);
const lanes = computed(() => (store.board.loaded ? store.board.lanes : SKELETON));
const empty = computed(() => store.board.loaded && lanes.value.every((lane) => !lane.cards.length));

const ASKS = {held: true, done: true};
const moving = ref(0);
const asking = ref(null);
const refusal = ref("");
let clearing = 0;

function take(got) {
    Object.assign(store.board, {lanes: got.lanes, agents: got.agents, planHold: got.plan_hold, loaded: true});
}

async function refresh() {
    take(await api.board(store.board.lens));
}

function move(card, lane) {
    if (ASKS[lane] || (card.lane === "done" && lane === "todo")) asking.value = {card, lane};
    else shift(card, lane, {});
}

async function shift(card, lane, words) {
    asking.value = null;
    moving.value = card.n;
    try {
        await api.shift(card.n, lane, words);
    } catch (e) {
        refusal.value = e.message;
        clearTimeout(clearing);
        clearing = setTimeout(() => (refusal.value = ""), 5000);
    } finally {
        await refresh();
        moving.value = 0;
    }
}

provide("board", {move, moving, refresh});

usePoll(
    "board",
    () => (boardOn.value ? api.board(store.board.lens) : Promise.resolve(null)),
    5000,
    (got) => got && take(got)
);
</script>

<template>
    <section class="board">
        <header class="bar">
            <h2>Board</h2>
            <template v-if="refusal">
                <p class="refusal">{{ refusal }}</p>
            </template>
        </header>
        <template v-if="!boardOn">
            <p class="off">
                The Kanban board is off.
                <a :href="`#/${route.env}/settings`">Turn it on in Settings</a>
            </p>
        </template>
        <template v-else-if="empty">
            <div class="empty">
                <p>Nothing is on the list.</p>
                <Btn kind="primary" small @click="adding = true">New to-do</Btn>
            </div>
        </template>
        <template v-else>
            <template v-if="store.board.planHold">
                <p class="hold">{{ store.board.planHold }}</p>
            </template>
            <div class="lanes">
                <template v-for="lane in lanes" :key="lane.key">
                    <Lane :lane="lane" :loading="!store.board.loaded" />
                </template>
            </div>
        </template>
        <template v-if="asking">
            <ShiftPrompt :ask="asking" @send="(words) => shift(asking.card, asking.lane, words)" @close="asking = null" />
        </template>
        <template v-if="adding">
            <NewResource type="todo" @made="(n) => peek('todo', n)" @close="adding = false" />
        </template>
    </section>
</template>

<style scoped>
.board {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
    min-height: 0;
    padding: 18px 20px;
}

.bar {
    display: flex;
    align-items: center;
    gap: 14px;
}

.refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.bar h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.hold {
    margin: 0;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12.5px;
}

.lanes {
    display: flex;
    flex: 1;
    gap: 12px;
    min-height: 0;
    overflow-x: auto;
    padding-bottom: 6px;
}

.off,
.empty p {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}
</style>
