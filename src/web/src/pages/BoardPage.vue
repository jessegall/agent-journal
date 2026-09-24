<script setup>
import {computed, onMounted, onUnmounted, provide, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Toast from "../kit/Toast.vue";
import AgentDrawer from "../board/AgentDrawer.vue";
import AgentSlots from "../board/AgentSlots.vue";
import AgentStrip from "../board/AgentStrip.vue";
import Lane from "../board/Lane.vue";
import Switch from "../kit/Switch.vue";
import TabBar from "../kit/TabBar.vue";
import NewBoard from "../board/NewBoard.vue";
import NewWork from "../board/NewWork.vue";
import BoardMenu from "../board/BoardMenu.vue";
import BuildStrip from "../board/BuildStrip.vue";
import {remember, remembered} from "../composables/remembered.js";
import {load as loadRows, patched, rows} from "../sync/rows.js";
import NotePrompt from "../board/NotePrompt.vue";
import ShiftPrompt from "../board/ShiftPrompt.vue";
import StopPrompt from "../board/StopPrompt.vue";
import NewResource from "../resource/NewResource.vue";
import {usePoll} from "../poll.js";
import {peek, route} from "../route.js";
import {boardOn, store} from "../state/store.js";

const SKELETON = ["To do", "Held", "Doing", "Needs you", "Done"].map((title) => ({key: title, title, cards: []}));
const adding = ref("");
const LIVE = new Set(["todo", "work", "question", "plan", "agent", "ticket", "board"]);
const text = ref("");
const plans = computed(() => rows("plan").filter((plan) => !plan.completed && !plan.deleted));
const boards = computed(() => rows("board").filter((board) => !board.completed && !board.deleted));
const archived = computed(() => rows("board").filter((board) => board.completed && !board.deleted));
const boardMenu = ref(false);
const boardMenuOpener = ref(null);
const boardMenuAnchor = computed(() => boardMenuOpener.value && boardMenuOpener.value.$el);
const tickets = computed(() => Boolean(store.board.lens.board));
const chosenBoard = computed(() => store.board.lens.board);
const slots = computed(() => store.board.slots);
const TODO_MEANINGS = {doing: "start", asked: "review", done: "done"};
const current = computed(() => boards.value.find((board) => board.n === store.board.lens.board));
const building = computed(() => tickets.value && current.value && (current.value.data.building || {}).since);
const ticketCount = computed(() => (store.board.lanes || []).reduce((sum, lane) => sum + lane.cards.length, 0));
const removed = (n) => settle(boards.value.filter((board) => board.n !== n));
const meaningOf = (key) => (tickets.value ? current.value && current.value.data.meanings[key] : TODO_MEANINGS[key]) || "";
const finder = ref(null);
const writingWork = ref(false);
const newBoard = ref(false);
const FIRST_BOARD_SEEN = "board.first-board-seen";
const workStage = ref("");
const newWork = (stage = "") => (tickets.value ? ((workStage.value = stage), (writingWork.value = true)) : (adding.value = "todo"));
const toast = ref(null);
const undo = () => toast.value && toast.value.action && (toast.value.action(), (toast.value = null));
const KEYS = {"/": () => finder.value.focus(), n: newWork, z: (e) => (e.metaKey || e.ctrlKey) && undo()};
const openFlow = () => writingWork.value || newBoard.value;
const onKey = (e) =>
    KEYS[e.key] && !e.target.closest("input,textarea,[contenteditable]") && !openFlow() && (e.preventDefault(), KEYS[e.key](e));
onMounted(async () => {
    window.addEventListener("keydown", onKey);
    const known = (await loadRows("board")).filter((board) => !board.completed && !board.deleted);
    newBoard.value = route.value.q === "new" || (!known.length && !remembered(FIRST_BOARD_SEEN, false));
    settle(known);
});

function settle(open) {
    if (open.some((board) => board.n === store.board.lens.board)) return;
    lens({board: open.length ? open[0].n : 0});
}

async function archive(board) {
    boardMenu.value = false;
    const at = boards.value.indexOf(board);
    const others = boards.value.filter((open) => open !== board);
    try {
        await patched(
            board,
            (row) => (row.completed = Date.now() / 1000),
            () => api.act("board", board.n, "complete")
        );
        settle([...others.slice(at), ...others.slice(0, at).reverse()]);
        toast.value = {text: `Archived ${board.title}`, label: "Undo", action: () => restore(board)};
    } catch (e) {
        refuse(e);
    }
}

async function restore(board) {
    boardMenu.value = false;
    try {
        await patched(
            board,
            (row) => (row.completed = 0),
            () => api.act("board", board.n, "reopen", {why: "Restored from the board menu"})
        );
        lens({board: board.n});
    } catch (e) {
        refuse(e);
    }
}

function leaveNewBoard() {
    newBoard.value = false;
    remember(FIRST_BOARD_SEEN, true);
}

function boardMade(n) {
    leaveNewBoard();
    lens({board: n});
}
onUnmounted(() => window.removeEventListener("keydown", onKey));
const chosenPlan = computed(() => store.board.lens.plan);

function made(n) {
    peek(adding.value, n);
    adding.value = "";
}

const showingDone = computed(() => store.board.lens.done !== false);
const planHold = computed(() => store.board.planHold);
const loading = computed(() => !store.board.loaded);
const tabs = computed(() => [{key: "0", title: "To-dos"}, ...boards.value.map((board) => ({key: String(board.n), title: board.title}))]);
const shown = computed({get: () => String(store.board.lens.board || 0), set: (key) => lens({board: Number(key)})});
const only = ref("");
watch(
    () => store.board.lens.board,
    () => (only.value = "")
);
const matches = (card) =>
    (!only.value || card.state === only.value) &&
    (!text.value.trim() || `#${card.n} ${card.title}`.toLowerCase().includes(text.value.trim().toLowerCase()));
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
const stopping = ref(null);
const watching = ref(null);
const noting = ref(null);
const askNote = (ask) => (noting.value = ask);
const watchAgent = (card) => (watching.value = card);
const LIVE_STATES = ["running", "you"];
const refusal = ref("");
let clearing = 0;

function refuse(e) {
    refusal.value = e.message;
    clearTimeout(clearing);
    clearing = setTimeout(() => (refusal.value = ""), 5000);
}

function take(got) {
    Object.assign(store.board, {
        lanes: got.lanes,
        agents: got.agents,
        slots: got.slots,
        roles: got.roles || [],
        questions: got.questions || [],
        drafting: got.drafting || {},
        expected: got.expected || 0,
        planHold: got.plan_hold,
        loaded: true,
    });
}

const load = () => (tickets.value ? api.ticketBoard(store.board.lens.board) : api.board(store.board.lens));

async function refresh() {
    await ask();
}

const leavesItsAgent = (card, lane) =>
    card.type === "ticket" && LIVE_STATES.includes(card.state) && meaningOf(card.lane) === "start" && meaningOf(lane) !== "start";

function move(card, lane) {
    if (leavesItsAgent(card, lane)) stopping.value = {card, lane};
    else if (card.type === "todo" && (ASKS[lane] || (card.lane === "done" && lane === "todo"))) asking.value = {card, lane};
    else return shift(card, lane, {});
    return null;
}

async function stopAndMove({card, lane}) {
    stopping.value = null;
    await api.act("ticket", card.n, "stop");
    shift(card, lane, {});
}

async function sendNote(note) {
    const {card, action} = noting.value;
    noting.value = null;
    await api.act(card.type, card.n, action.action, {note});
    refresh();
}

function keepAndMove({card, lane}) {
    stopping.value = null;
    shift(card, lane, {});
}

const laneTitle = (key) => (store.board.lanes.find((lane) => lane.key === key) || {title: key}).title;

async function shift(card, lane, words) {
    asking.value = null;
    moving.value = card.n;
    try {
        await (card.type === "ticket" ? api.moveTicket(card.n, lane) : api.shift(card.n, lane, words));
        toast.value = {text: `Moved #${card.n} to ${laneTitle(lane)}`, label: "Undo", action: () => move({...card, lane}, card.lane)};
    } catch (e) {
        refuse(e);
    } finally {
        await refresh();
        moving.value = 0;
    }
}

provide("board", {move, moving, refresh, meaningOf, newWork, watchAgent, askNote});

const lens = (change) => (store.board.lens = {...store.board.lens, ...change});
watch(() => [store.board.lens.plan, store.board.lens.agent, store.board.lens.board], refresh);
watch(
    () => store.board.drafting.since,
    (drafting) => drafting && tickets.value && (writingWork.value = true),
    {immediate: true}
);

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

const ask = usePoll(
    "board",
    () => (boardOn.value ? load() : Promise.resolve(null)),
    5000,
    (got) => got && take(got)
);
</script>

<template>
    <section class="board">
        <header class="bar">
            <h2>Board</h2>
            <TabBar v-model="shown" :tabs="tabs">
                <button type="button" class="tool" title="New board" @click="newBoard = true"><Icon name="plus" /></button>
            </TabBar>
            <template v-if="current || archived.length">
                <Btn ref="boardMenuOpener" kind="icon" title="Board settings" @click.stop="boardMenu = !boardMenu">
                    <Icon name="settings" />
                </Btn>
            </template>
            <template v-if="boardMenu">
                <BoardMenu
                    :board="current"
                    :archived="archived"
                    :anchor="boardMenuAnchor"
                    @close="boardMenu = false"
                    @archive="archive"
                    @restore="restore"
                />
            </template>
            <input ref="finder" v-model="text" class="find" placeholder="Filter cards  /" />
            <template v-if="!tickets">
                <div class="plans">
                    <button type="button" :class="['plan', {on: !chosenPlan}]" @click="lens({plan: 0})">All to-dos</button>
                    <template v-for="plan in plans" :key="plan.n">
                        <button type="button" :class="['plan', {on: chosenPlan === plan.n}]" @click="lens({plan: plan.n})">
                            Plan {{ plan.n }}
                        </button>
                    </template>
                </div>
            </template>
            <span class="grow" />
            <Switch :on="showingDone" word="Show done" @change="(on) => lens({done: on})" />
            <Btn kind="primary" small title="New work (N)" @click="newWork('')">New work</Btn>
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
        <template v-else-if="empty && !tickets">
            <div class="empty">
                <p>Nothing is on the list.</p>
                <Btn kind="primary" small @click="newWork('')">New to-do</Btn>
            </div>
        </template>
        <template v-else>
            <AgentStrip />
            <template v-if="building">
                <BuildStrip :board="current" :tickets="ticketCount" @removed="removed" @refused="refuse" />
            </template>
            <template v-if="tickets && slots">
                <AgentSlots :slots="slots" :only="only" @only="(state) => (only = only === state ? '' : state)" />
            </template>
            <template v-if="planHold">
                <p class="hold">{{ planHold }}</p>
            </template>
            <div :key="chosenBoard || 0" class="lanes">
                <template v-for="(lane, i) in lanes" :key="lane.key">
                    <Lane
                        :lane="lane"
                        :loading="loading"
                        :meaning="meaningOf(lane.key)"
                        :offers="tickets && !i && !lane.cards.length"
                        :adds="tickets"
                        :style="{'--order': i}"
                    />
                </template>
            </div>
        </template>
        <Toast :toast="toast" @done="toast = null" />
        <template v-if="noting">
            <NotePrompt :ask="noting" @send="sendNote" @close="noting = null" />
        </template>
        <template v-if="watching">
            <AgentDrawer :card="watching" @close="watching = null" @stopped="refresh" />
        </template>
        <template v-if="stopping">
            <StopPrompt :move="stopping" @stop="stopAndMove(stopping)" @keep="keepAndMove(stopping)" @close="stopping = null" />
        </template>
        <template v-if="asking">
            <ShiftPrompt :ask="asking" @send="(words) => shift(asking.card, asking.lane, words)" @close="asking = null" />
        </template>
        <NewBoard :open="newBoard" @close="leaveNewBoard" @made="boardMade" />
        <template v-if="tickets && current">
            <NewWork
                :open="writingWork"
                :board="current"
                :stage="workStage"
                :starts="meaningOf(workStage) === 'start'"
                @close="writingWork = false"
                @added="refresh"
            />
        </template>
        <template v-if="adding">
            <NewResource :type="adding" @made="made" @close="adding = ''" />
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

.grow {
    flex: 1;
}

.tool {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border: 0;
    border-radius: 7px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.tool:hover {
    background: var(--hover);
    color: var(--text);
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
