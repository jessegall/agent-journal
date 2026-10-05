<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {saveSettings} from "../actions/settings.js";
import {workingCards} from "../domain/ticketAgents.js";
import AgentDrawer from "../agents/AgentDrawer.vue";
import TicketAgent from "../agents/TicketAgent.vue";
import BoardGoal from "./BoardGoal.vue";
import BoardLanes from "./BoardLanes.vue";
import BoardRoles from "./BoardRoles.vue";
import BoardStrips from "./BoardStrips.vue";
import BuildStrip from "./BuildStrip.vue";
import NewWork from "./NewWork.vue";
import RunBar from "./RunBar.vue";
import StopPrompt from "./StopPrompt.vue";
import {useBoardShift} from "./boardShift.js";
import {named, shownLanes} from "./lanes.js";

const props = defineProps({
    board: {type: Object, default: null},
    text: {type: String, default: ""},
    refusal: {type: String, default: ""},
    refresh: {type: Function, required: true},
    refuse: {type: Function, required: true},
    notify: {type: Function, required: true},
});
const emit = defineEmits(["removed"]);
const LIVE_STATES = ["running", "you"];
const only = ref("");
const writing = ref(false);
const stage = ref("");
const starting = ref(false);
const stopping = ref(null);
const watching = ref(null);
const opened = ref(null);
const slots = computed(() => store.board.slots);
const building = computed(() => props.board && (props.board.data.building || {}).since);
const firstLane = computed(() => (store.board.lanes || [])[0] || {key: "", cards: []});
const waitingCount = computed(() => firstLane.value.cards.length + ((slots.value && slots.value.queued) || 0));
const waits = (card) => card.lane === firstLane.value.key || card.state === "queued";
const ticketCount = computed(() => (store.board.lanes || []).reduce((sum, lane) => sum + lane.cards.length, 0));
const meaningOf = (key) => (props.board && props.board.data.meanings[key]) || "";
const kept = (card) => !only.value || (only.value === "waiting" ? waits(card) : card.state === only.value);
const lanes = computed(() => shownLanes(meaningOf, (card) => kept(card) && named(props.text)(card)));
const allCards = computed(() => (store.board.lanes || []).flatMap((lane) => lane.cards));
const agentCard = computed(
    () => opened.value && (allCards.value.find((card) => card.type === "ticket" && card.n === opened.value.n) || opened.value)
);
const working = computed(() => workingCards(store.board.lanes));
const newWork = (lane = "") => ((stage.value = lane), (writing.value = true));
const {moving, shift} = useBoardShift({
    send: (card, lane, words) => (card.type === "ticket" ? api.moveTicket(card.n, lane) : api.shift(card.n, lane, words)),
    move,
    refresh: () => props.refresh(),
    refuse: (e) => props.refuse(e),
    notify: (toast) => props.notify(toast),
});
const leavesItsAgent = (card, lane) =>
    card.type === "ticket" && LIVE_STATES.includes(card.state) && meaningOf(card.lane) === "start" && meaningOf(lane) !== "start";

function move(card, lane) {
    if (leavesItsAgent(card, lane)) stopping.value = {card, lane};
    else return shift(card, lane);
    return null;
}

async function stopAndMove({card, lane}) {
    stopping.value = null;
    await api.stopTicket(card.n);
    shift(card, lane);
}

function keepAndMove({card, lane}) {
    stopping.value = null;
    shift(card, lane);
}

async function setLimit(n) {
    store.board.slots = {...store.board.slots, limit: n};
    try {
        await saveSettings({tickets: {...((store.settings && store.settings.tickets) || {}), running: n}});
    } catch (e) {
        props.refuse(e);
    }
    props.refresh();
}

async function run(act) {
    starting.value = true;
    try {
        await act();
    } catch (e) {
        props.refuse(e);
    } finally {
        starting.value = false;
    }
}

const startBoard = () =>
    run(async () => {
        await api.startBoard(props.board.n);
        props.notify({text: `The main agent runs ${props.board.title}`});
    });
const boardAction = (action) => run(() => api.act("board", props.board.n, action));

watch(
    () => store.board.drafting.since,
    (drafting) => drafting && (writing.value = true),
    {immediate: true}
);

defineExpose({newWork, writing});
</script>

<template>
    <template v-if="board && !building">
        <RunBar
            :board="board"
            :cards="working"
            :slots="slots"
            :waiting="waitingCount"
            :only="only"
            :busy="starting"
            @play="startBoard"
            @pause="boardAction('pause')"
            @resume="boardAction('resume')"
            @open="(card) => (opened = card)"
            @only="(state) => (only = only === state ? '' : state)"
            @limit="setLimit"
        />
        <BoardGoal :board="board" />
        <template v-if="store.board.roles.length">
            <BoardRoles :roles="store.board.roles" />
        </template>
    </template>
    <BoardStrips :refusal="refusal">
        <template v-if="building">
            <BuildStrip :board="board" :tickets="ticketCount" @removed="(n) => emit('removed', n)" @refused="refuse" />
        </template>
    </BoardStrips>
    <BoardLanes
        :lanes="lanes"
        :meaning-of="meaningOf"
        :move="move"
        :moving="moving"
        :refresh="refresh"
        :new-work="newWork"
        :open-agent="(card) => (opened = card)"
        :watch-agent="(card) => (watching = card)"
        adds
    />
    <template v-if="agentCard">
        <TicketAgent :card="agentCard" @close="opened = null" @terminal="watching = agentCard" />
    </template>
    <template v-if="watching">
        <AgentDrawer :card="watching" @close="watching = null" @stopped="refresh" />
    </template>
    <template v-if="stopping">
        <StopPrompt :move="stopping" @stop="stopAndMove(stopping)" @keep="keepAndMove(stopping)" @close="stopping = null" />
    </template>
    <template v-if="board">
        <NewWork
            :open="writing"
            :board="board"
            :stage="stage"
            :starts="meaningOf(stage) === 'start'"
            @close="writing = false"
            @added="refresh"
        />
    </template>
</template>
