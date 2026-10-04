<script setup>
import {saveSettings} from "../actions/settings.js";
import {computed, onMounted, onUnmounted, provide, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import TextInput from "../kit/TextInput.vue";
import Icon from "../kit/Icon.vue";
import Toast from "../kit/Toast.vue";
import AgentDrawer from "../board/AgentDrawer.vue";
import TicketAgent from "../board/TicketAgent.vue";
import {workingCards} from "../domain/ticketAgents.js";
import BoardRoles from "../board/BoardRoles.vue";
import AgentStrip from "../board/AgentStrip.vue";
import Lane from "../board/Lane.vue";
import Segmented from "../kit/Segmented.vue";
import Switch from "../kit/Switch.vue";
import TabBar from "../kit/TabBar.vue";
import NewBoard from "../board/NewBoard.vue";
import NewWork from "../board/NewWork.vue";
import RunBar from "../board/RunBar.vue";
import BoardGoal from "../board/BoardGoal.vue";
import BoardMenu from "../board/BoardMenu.vue";
import BuildStrip from "../board/BuildStrip.vue";
import {remember, remembered} from "../composables/remembered.js";
import {load as loadRows, patched, rows} from "../sync/rows.js";
import NotePrompt from "../board/NotePrompt.vue";
import ShiftPrompt from "../board/ShiftPrompt.vue";
import StopPrompt from "../board/StopPrompt.vue";
import NewResource from "../resource/NewResource.vue";
import {poke, usePoll} from "../poll.js";
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
const firstLane = computed(() => (store.board.lanes || [])[0] || {key: "", cards: []});
const waitingCount = computed(() => (tickets.value ? firstLane.value.cards.length + ((slots.value && slots.value.queued) || 0) : 0));
const waits = (card) => card.lane === firstLane.value.key || card.state === "queued";
const searching = ref(false);
const picked = ref("");
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
const chosenTab = computed({get: () => String(store.board.lens.board || 0), set: (key) => lens({board: Number(key)})});
const only = ref("");
watch(
    () => store.board.lens.board,
    () => (only.value = "")
);
const matches = (card) =>
    (!only.value || (only.value === "waiting" ? waits(card) : card.state === only.value)) &&
    (!text.value.trim() || `#${card.n} ${card.title}`.toLowerCase().includes(text.value.trim().toLowerCase()));
const lanes = computed(() =>
    store.board.loaded
        ? store.board.lanes
              .filter((lane) => store.board.lens.done !== false || meaningOf(lane.key) !== "done")
              .map((lane) => ({...lane, cards: lane.cards.filter(matches)}))
        : SKELETON
);
const pickedLane = computed(
    () =>
        (lanes.value.find((lane) => lane.key === picked.value) || lanes.value.find((lane) => lane.cards.length) || lanes.value[0] || {}).key
);
const lanePicks = computed(() => lanes.value.map((lane) => ({key: lane.key, label: `${lane.title} ${lane.cards.length}`})));
const empty = computed(() => store.board.loaded && lanes.value.every((lane) => !lane.cards.length));

const ASKS = {held: true, done: true};
const moving = ref(0);
const asking = ref(null);
const stopping = ref(null);
const watching = ref(null);
const noting = ref(null);
const askNote = (ask) => (noting.value = ask);
const watchAgent = (card) => (watching.value = card);
const opened = ref(null);
const openAgent = (card) => (opened.value = card);
const allCards = computed(() => (store.board.lanes || []).flatMap((lane) => lane.cards));
const agentCard = computed(
    () => opened.value && (allCards.value.find((card) => card.type === "ticket" && card.n === opened.value.n) || opened.value)
);
const working = computed(() => (tickets.value ? workingCards(store.board.lanes) : []));
const starting = ref(false);

async function setLimit(n) {
    store.board.slots = {...store.board.slots, limit: n};
    try {
        await saveSettings({tickets: {...((store.settings && store.settings.tickets) || {}), running: n}});
    } catch (e) {
        refuse(e);
    }
    refresh();
}

async function startBoard() {
    starting.value = true;
    try {
        await api.act("board", current.value.n, "start");
        toast.value = {text: `The main agent runs ${current.value.title}`};
    } catch (e) {
        refuse(e);
    } finally {
        starting.value = false;
    }
}
async function boardAction(action) {
    starting.value = true;
    try {
        await api.act("board", current.value.n, action);
    } catch (e) {
        refuse(e);
    } finally {
        starting.value = false;
    }
}
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

provide("board", {move, moving, refresh, meaningOf, newWork, watchAgent, openAgent, askNote});

const lens = (change) => (store.board.lens = {...store.board.lens, ...change});
watch(() => [store.board.lens.plan, store.board.lens.agent, store.board.lens.board], refresh);
watch(
    () => store.board.drafting.since,
    (drafting) => drafting && tickets.value && (writingWork.value = true),
    {immediate: true}
);

let seen = 0;
watch(
    () => (store.events.length ? store.events[store.events.length - 1].id : 0),
    (newest) => {
        const fresh = store.events.some((event) => event.id > seen && LIVE.has(event.type));
        seen = newest;
        if (fresh) poke("board");
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
            <TabBar v-model="chosenTab" :tabs="tabs" class="board-tabs" />
            <Btn kind="icon" class="new-board" title="New board" @click="newBoard = true">
                <Icon name="plus" />
            </Btn>
            <Btn
                ref="boardMenuOpener"
                kind="icon"
                :class="['board-settings', {spare: !current && !archived.length}]"
                title="Board settings"
                @click.stop="boardMenu = !boardMenu"
            >
                <Icon name="settings" />
            </Btn>
            <template v-if="boardMenu">
                <BoardMenu
                    :board="current"
                    :archived="archived"
                    :anchor="boardMenuAnchor"
                    @close="boardMenu = false"
                    @archive="archive"
                    @restore="restore"
                    @new="((boardMenu = false), (newBoard = true))"
                />
            </template>
            <span class="grow" />
            <Btn kind="icon" :class="['search', {on: searching}]" title="Filter cards" @click="searching = !searching">
                <Icon name="search" />
                <template v-if="text.trim()">
                    <span class="search-dot" />
                </template>
            </Btn>
            <div :class="['tools', {searching}]">
                <TextInput ref="finder" :value="text" class="find" placeholder="Filter cards  /" @input="text = $event.target.value" />
                <Switch :on="showingDone" word="Show done cards" @change="(on) => lens({done: on})" />
            </div>
            <Btn kind="primary" small title="New work (N)" @click="newWork('')">
                <Icon name="plus" />
                New work
            </Btn>
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
            <template v-if="tickets && current && !building">
                <RunBar
                    :board="current"
                    :cards="working"
                    :slots="slots"
                    :waiting="waitingCount"
                    :only="only"
                    :busy="starting"
                    @play="startBoard"
                    @pause="boardAction('pause')"
                    @resume="boardAction('resume')"
                    @open="openAgent"
                    @only="(state) => (only = only === state ? '' : state)"
                    @limit="setLimit"
                />
                <BoardGoal :board="current" />
                <template v-if="store.board.roles.length">
                    <BoardRoles :roles="store.board.roles" />
                </template>
            </template>
            <template v-if="!tickets">
                <div class="plans">
                    <Btn :class="['plan', {on: !chosenPlan}]" @click="lens({plan: 0})">All to-dos</Btn>
                    <template v-for="plan in plans" :key="plan.n">
                        <Btn :class="['plan', {on: chosenPlan === plan.n}]" @click="lens({plan: plan.n})">Plan {{ plan.n }}</Btn>
                    </template>
                    <span class="grow" />
                    <AgentStrip />
                </div>
            </template>
            <template v-if="building || refusal || planHold">
                <div class="strips">
                    <template v-if="building">
                        <BuildStrip :board="current" :tickets="ticketCount" @removed="removed" @refused="refuse" />
                    </template>
                    <template v-if="refusal">
                        <p class="refusal">{{ refusal }}</p>
                    </template>
                    <template v-if="planHold">
                        <p class="hold">{{ planHold }}</p>
                    </template>
                </div>
            </template>
            <div class="lane-pick">
                <Segmented fill :options="lanePicks" :value="pickedLane" @pick="(key) => (picked = key)" />
            </div>
            <div :key="chosenBoard || 0" class="lanes">
                <template v-for="(lane, i) in lanes" :key="lane.key">
                    <Lane
                        :class="{away: lane.key !== pickedLane}"
                        :lane="lane"
                        :loading="loading"
                        :meaning="meaningOf(lane.key)"
                        :adds="tickets && !i"
                        :style="{'--order': i}"
                    />
                </template>
            </div>
        </template>
        <Toast :toast="toast" @done="toast = null" />
        <template v-if="noting">
            <NotePrompt :ask="noting" @send="sendNote" @close="noting = null" />
        </template>
        <template v-if="agentCard">
            <TicketAgent :card="agentCard" @close="opened = null" @terminal="watching = agentCard" />
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
    height: 100%;
    min-height: 0;
}

.bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 4px;
    height: 44px;
    padding: 0 12px;
    border-bottom: 1px solid var(--border);
}

.board-tabs {
    flex: 0 1 auto;
    align-self: stretch;
    min-width: 0;
    padding: 0 8px;
}

.grow {
    flex: 1;
    min-width: 8px;
}

.new-board {
    flex: none;
}

.board-settings {
    flex: none;
}

.bar .board-settings.spare {
    display: none;
}

.bar .search {
    position: relative;
    display: none;
}

.search.on {
    background: var(--sel);
    color: var(--text);
}

.search-dot {
    position: absolute;
    top: 9px;
    right: 9px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-text);
    box-shadow: 0 0 0 2px var(--bg);
}

.tools {
    display: flex;
    flex: none;
    align-items: center;
    gap: 12px;
    margin-right: 8px;
}

.find {
    width: 200px;
    height: 28px;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--side);
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

.strips {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 10px;
    padding: 12px 20px 0;
}

.refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
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

.lane-pick {
    display: none;
}

.lanes {
    display: flex;
    flex: 1;
    gap: 12px;
    min-height: 0;
    padding: 14px 20px 20px;
    overflow-x: auto;
}

.off,
.empty {
    padding: 18px 20px;
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

@media (max-width: 900px) {
    .find {
        width: 150px;
    }
}

@media (max-width: 640px) {
    .bar {
        flex-wrap: wrap;
        height: auto;
        min-height: 44px;
        padding: 0 6px 0 4px;
        row-gap: 0;
    }

    .board-tabs {
        flex: 1 1 0;
        height: 44px;
    }

    .bar .new-board {
        display: none;
    }

    .bar .board-settings.spare {
        display: grid;
    }

    .bar .search {
        display: grid;
    }

    .bar .search,
    .bar .board-settings {
        width: 40px;
        height: 40px;
    }

    .grow {
        display: none;
    }

    .tools {
        display: none;
        order: 10;
        flex-basis: 100%;
        height: 52px;
        margin: 0 -6px 0 -4px;
        padding: 0 14px;
        border-top: 1px solid var(--border);
    }

    .tools.searching {
        display: flex;
    }

    .find {
        flex: 1;
        width: auto;
        height: 36px;
    }

    .plans {
        padding: 6px 14px;
    }

    .lane-pick {
        display: block;
        flex: none;
        margin: 12px 14px 0;
    }

    .lanes {
        padding: 12px 14px 16px;
    }

    .lanes > .away {
        display: none;
    }

    .lanes > :deep(.lane) {
        max-width: none;
    }
}
</style>
