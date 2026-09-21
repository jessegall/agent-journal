<script setup>
import {computed, provide, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import AgentStrip from "../board/AgentStrip.vue";
import Lane from "../board/Lane.vue";
import Switch from "../kit/Switch.vue";
import {rows} from "../sync/rows.js";
import ShiftPrompt from "../board/ShiftPrompt.vue";
import NewResource from "../resource/NewResource.vue";
import {usePoll} from "../poll.js";
import {peek, route} from "../route.js";
import {boardOn, store} from "../state/store.js";

const SKELETON = ["To do", "Held", "Doing", "Needs you", "Done"].map((title) => ({key: title, title, cards: []}));
const adding = ref(false);
const LIVE = new Set(["todo", "work", "question", "plan", "agent"]);
const text = ref("");
const plans = computed(() => rows("plan").filter((plan) => !plan.completed && !plan.deleted));
const matches = (card) => !text.value.trim() || `#${card.n} ${card.title}`.toLowerCase().includes(text.value.trim().toLowerCase());
const lanes = computed(() =>
    store.board.loaded
        ? store.board.lanes
              .filter((lane) => store.board.lens.done !== false || lane.key !== "done")
              .map((lane) => ({...lane, cards: lane.cards.filter(matches)}))
        : SKELETON
);
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

const lens = (change) => (store.board.lens = {...store.board.lens, ...change});
watch(() => [store.board.lens.plan, store.board.lens.agent], refresh);

let seen = 0;
let waiting = 0;
watch(
    () => (store.events.length ? store.events[store.events.length - 1].id : 0),
    (newest) => {
        const fresh = store.events.some((event) => event.id > seen && LIVE.has(event.type));
        seen = newest;
        if (!fresh) return;
        clearTimeout(waiting);
        waiting = setTimeout(refresh, 300);
    }
);

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
            <input v-model="text" class="find" placeholder="Filter by title or #number" />
            <div class="plans">
                <button type="button" :class="['plan', {on: !store.board.lens.plan}]" @click="lens({plan: 0})">All to-dos</button>
                <template v-for="plan in plans" :key="plan.n">
                    <button type="button" :class="['plan', {on: store.board.lens.plan === plan.n}]" @click="lens({plan: plan.n})">
                        Plan {{ plan.n }}
                    </button>
                </template>
            </div>
            <Switch :on="store.board.lens.done !== false" word="Show done" @change="(on) => lens({done: on})" />
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
            <AgentStrip />
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
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
}

.find {
    width: 200px;
    padding: 5px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

.find:focus {
    border-color: var(--accent);
    outline: none;
}

.plans {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
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
