<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import ChatLine from "../kit/ChatLine.vue";
import ChatPanel from "../kit/ChatPanel.vue";
import FocusStage from "../kit/FocusStage.vue";
import {sendMessage} from "../chat/outbox.js";
import {quoted} from "../format/quote.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import Suggestion from "./Suggestion.vue";
import AskedQuestion from "./AskedQuestion.vue";
import DraftDetail from "./DraftDetail.vue";

const props = defineProps({open: Boolean, board: Object, stage: {type: String, default: ""}, starts: Boolean});
const emit = defineEmits(["close", "added"]);
const now = () => Date.now() / 1000;
const words = ref("");
const lines = ref([]);
const sent = ref([]);
const since = ref(0);
const lastSent = ref(0);
const picked = ref([]);
const adding = ref(false);
const panel = ref(null);
const revealed = ref([]);
const docked = ref(false);
const SKELETONS = 3;
const INPUT_LIMIT = 280;
const OPEN_TURNS = 2;
const shownDraft = ref(null);
const FADED = 400;
const THINKING = [
    "Reading the board",
    "Looking at what is already there",
    "Splitting the work",
    "Weighing what comes first",
    "Writing the tickets",
];

const asked = computed(() => rows("message").filter((m) => sent.value.includes(m.data.idempotency)));
const replies = computed(() => {
    const refs = asked.value.map((m) => m.ref);
    return rows("comment").filter((c) => c.refs.some((ref) => refs.includes(ref)));
});
const boardQuestions = computed(() => (since.value ? store.board.questions.filter((q) => q.created >= since.value) : []));
const asking = computed(() => boardQuestions.value.find((q) => !q.completed));
const conversation = computed(() =>
    [
        ...lines.value,
        ...replies.value.map((c) => ({id: c.ref, mine: false, typed: true, at: c.created, text: quoted(c.brief || c.title).text})),
        ...boardQuestions.value
            .filter((q) => q.completed)
            .map((q) => ({id: q.ref, record: true, at: q.completed, text: `Asked: ${q.title} → ${q.outcome}`})),
    ].sort((a, b) => a.at - b.at)
);
const drafts = computed(() =>
    rows("ticket").filter(
        (t) => t.data.draft && Number(t.data.board) === props.board.n && t.created >= since.value && !t.deleted && !t.completed
    )
);
const writing = computed(() => Boolean(lastSent.value) && !replies.value.some((c) => c.created >= lastSent.value));
const turn = computed(() => drafts.value.find((t) => !revealed.value.includes(t.n)));
const cards = computed(() => {
    const ahead = writing.value ? Math.max(SKELETONS - drafts.value.length, 1) : 0;
    return [...drafts.value, ...Array(ahead).fill(null)].map((ticket, order) => ({order, ticket}));
});
const shownDrafts = computed(() => drafts.value.filter((t) => revealed.value.includes(t.n)));
const reveal = (n) => (revealed.value = [...revealed.value, n]);
const STALLED_AFTER = 120000;
const stalled = ref(false);
const lastAsked = ref("");
let stallTimer = 0;
watch(writing, (on) => {
    clearTimeout(stallTimer);
    stalled.value = false;
    if (on) stallTimer = setTimeout(() => (stalled.value = writing.value && !drafts.value.length), STALLED_AFTER);
});
const first = computed(() => props.stage || props.board.data.stages[0]);
const unpicked = () => drafts.value.filter((t) => !picked.value.includes(t.n));
const waitsOn = (ticket) => Object.keys(ticket.data.dependencies || {}).map((ref) => Number(ref.split(":")[1]));
const missing = computed(() =>
    drafts.value
        .filter((t) => picked.value.includes(t.n))
        .flatMap((t) =>
            waitsOn(t)
                .filter((n) => drafts.value.some((d) => d.n === n) && !picked.value.includes(n))
                .map((n) => ({ticket: t.n, waitsOn: n}))
        )
);
const note = computed(() => {
    if (asking.value) return "The agent needs your answer in the chat.";
    if (writing.value && !picked.value.length) return `${drafts.value.length} drafted so far. Click a card to keep it.`;
    if (missing.value.length) return `#${missing.value[0].ticket} waits on #${missing.value[0].waitsOn}, which you did not pick.`;
    if (!picked.value.length) return "Click a card to keep it.";
    return props.starts ? `They go to ${first.value}, and their agents start.` : `They go to ${first.value}, ready to start.`;
});
const pickMissing = () => (picked.value = [...new Set([...picked.value, ...missing.value.map((m) => m.waitsOn)])]);
const toggle = (n) => (picked.value = picked.value.includes(n) ? picked.value.filter((p) => p !== n) : [...picked.value, n]);
const drop = (tickets) => Promise.all(tickets.map((t) => api.act("ticket", t.n, "delete", {why: "not picked in New work"})));
const say = (mine, text) => (lines.value = [...lines.value, {id: `${now()}-${lines.value.length}`, mine, text, typed: !mine, at: now()}]);

function onKey(e) {
    if (!props.open) return;
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && picked.value.length) return (e.preventDefault(), add());
    const shown = shownDrafts.value[Number(e.key) - 1];
    if (shown && !e.target.closest("input,textarea,[contenteditable='true']")) (e.preventDefault(), toggle(shown.n));
}

watch(
    () => drafts.value.length >= 1 || replies.value.length >= OPEN_TURNS,
    (dock) => dock && (docked.value = true),
    {immediate: true}
);

onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));

watch(
    () => props.open,
    (open) => {
        if (!open) return;
        if (!lines.value.length) say(false, `What do you want to get done on ${props.board.title}?`);
        panel.value.focus();
    }
);

async function send(text) {
    words.value = "";
    say(true, text);
    since.value = since.value || now() - 5;
    lastSent.value = now() - 1;
    lastAsked.value = text;
    await drop(unpicked());
    await ask(text);
}

async function ask(text) {
    const message = await sendMessage(route.value.env, {brief: text, about: props.board.ref, newWork: true});
    sent.value = [...sent.value, message.id];
}

function askAgain() {
    stalled.value = false;
    lastSent.value = now() - 1;
    ask(lastAsked.value);
}

async function again() {
    await drop(unpicked());
    say(false, "What should I do differently?");
    panel.value.focus();
}

async function add() {
    adding.value = true;
    const keep = picked.value;
    const dropped = unpicked().map((t) => t.n);
    await Promise.all(keep.map((n) => api.act("ticket", n, "confirm")));
    if (first.value !== props.board.data.stages[0]) await Promise.all(keep.map((n) => api.moveTicket(n, first.value)));
    await Promise.all(
        drafts.value
            .filter((t) => keep.includes(t.n) && waitsOn(t).length)
            .map((t) =>
                api.act("ticket", t.n, waitsOn(t).some((n) => dropped.includes(n)) ? "decline_dependencies" : "accept_dependencies")
            )
    );
    await drop(unpicked());
    adding.value = false;
    startAnew();
    emit("added", keep.length);
    emit("close");
    setTimeout(() => (docked.value = false), FADED);
}

function startAnew() {
    words.value = "";
    lines.value = [];
    sent.value = [];
    since.value = 0;
    lastSent.value = 0;
    picked.value = [];
}

async function leave() {
    await drop(unpicked());
    startAnew();
    emit("close");
}
</script>

<template>
    <FocusStage :open="open" leave="Back to the board" glow spread :docked="docked" @close="leave">
        <div :class="['work', {on: docked}]">
            <div class="bar">
                <span class="note">{{ note }}</span>
                <div :class="['bar-actions', {on: drafts.length && !writing}]">
                    <template v-if="missing.length">
                        <Btn small @click="pickMissing">Pick it too</Btn>
                    </template>
                    <Btn small @click="again">Try another split</Btn>
                    <Btn kind="primary" small :busy="adding" :disabled="!picked.length" @click="add">
                        {{ picked.length ? `Add ${picked.length} to ${first}` : `Add to ${first}` }}
                    </Btn>
                </div>
            </div>
            <TransitionGroup tag="div" name="pick" class="picks">
                <template v-for="card in cards" :key="card.order">
                    <Suggestion
                        :ticket="card.ticket"
                        :order="card.order"
                        :active="Boolean(card.ticket) && card.ticket === turn"
                        :paused="Boolean(asking)"
                        :picked="Boolean(card.ticket) && picked.includes(card.ticket.n)"
                        @toggle="toggle(card.ticket.n)"
                        @revealed="reveal(card.ticket.n)"
                        @more="(from) => (shownDraft = {ticket: card.ticket, from})"
                    />
                </template>
            </TransitionGroup>
        </div>
        <div :class="['dock', {docked}]">
            <ChatPanel
                ref="panel"
                v-model="words"
                fill
                :locked="adding"
                :limit="INPUT_LIMIT"
                :placeholder="drafts.length ? 'Say what to change' : 'Describe the work in your own words'"
                @send="send"
            >
                <template #head>
                    <div :class="['head', {on: docked}]">
                        <span class="head-title">
                            New work
                            <span class="head-board">{{ board.title }}</span>
                        </span>
                        <Btn small @click="emit('close')">
                            Back to the board
                            <kbd>Esc</kbd>
                        </Btn>
                    </div>
                </template>
                <template v-for="line in conversation" :key="line.id">
                    <template v-if="line.record">
                        <span class="record">{{ line.text }}</span>
                    </template>
                    <template v-else>
                        <ChatLine :text="line.text" :mine="line.mine" :typed="line.typed" />
                    </template>
                </template>
                <template v-if="asking">
                    <AskedQuestion :question="asking" />
                </template>
                <template v-if="writing && !asking">
                    <ChatLine thinking :notes="THINKING" />
                </template>
                <template v-if="stalled">
                    <ChatLine text="No answer yet. The agent may be busy with other work." />
                    <Btn small @click="askAgain">Ask again</Btn>
                </template>
            </ChatPanel>
        </div>
        <template v-if="shownDraft">
            <DraftDetail :ticket="shownDraft.ticket" :from="shownDraft.from" @close="shownDraft = null" />
        </template>
    </FocusStage>
</template>

<style scoped>
.dock {
    position: absolute;
    top: calc(50% - min(200px, 26vh));
    left: calc(50% - min(340px, 50% - 16px));
    width: min(680px, calc(100% - 32px));
    height: min(400px, 52vh);
    transition:
        top 0.45s cubic-bezier(0.2, 0.9, 0.25, 1),
        left 0.45s cubic-bezier(0.2, 0.9, 0.25, 1),
        width 0.45s cubic-bezier(0.2, 0.9, 0.25, 1),
        height 0.45s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.dock.docked {
    top: 20px;
    left: 20px;
    width: 400px;
    height: calc(100% - 40px);
}

.head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    height: 0;
    overflow: hidden;
    padding: 0 8px 0 16px;
    border-bottom: 1px solid transparent;
    opacity: 0;
    transition:
        height 0.45s cubic-bezier(0.2, 0.9, 0.25, 1),
        opacity 0.2s,
        border-color 0.2s;
}

.head.on {
    height: 48px;
    border-bottom-color: var(--border);
    opacity: 1;
    transition:
        height 0.45s cubic-bezier(0.2, 0.9, 0.25, 1),
        opacity 0.3s 0.2s,
        border-color 0.3s 0.2s;
}

.head-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.head-board {
    margin-left: 6px;
    color: var(--text-4);
    font-weight: 400;
}

kbd {
    padding: 1px 5px;
    border: 1px solid var(--border-2);
    border-radius: 4px;
    font: inherit;
    font-size: 10.5px;
}

.work {
    position: absolute;
    top: 20px;
    right: 20px;
    bottom: 20px;
    left: 440px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    opacity: 0;
    pointer-events: none;
    transform: translateX(16px);
    transition:
        opacity 0.3s cubic-bezier(0.2, 0.9, 0.25, 1),
        transform 0.45s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.work.on {
    opacity: 1;
    pointer-events: auto;
    transform: none;
    transition:
        opacity 0.45s cubic-bezier(0.2, 0.9, 0.25, 1) 0.08s,
        transform 0.45s cubic-bezier(0.2, 0.9, 0.25, 1) 0.08s;
}

.bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    height: 44px;
    padding: 0 6px 0 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: rgba(24, 25, 28, 0.94);
    backdrop-filter: blur(20px);
}

.bar-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(3px);
    transition:
        opacity 0.25s,
        transform 0.25s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.bar-actions.on {
    opacity: 1;
    pointer-events: auto;
    transform: none;
}

.picks {
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: 320px;
    align-content: start;
    gap: 14px;
    min-height: 0;
    overflow-y: auto;
    padding: 2px 2px 8px;
    scrollbar-width: none;
}

.pick-move {
    transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.pick-leave-active {
    transition:
        opacity 0.2s cubic-bezier(0.4, 0, 1, 1),
        transform 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.pick-leave-to {
    opacity: 0;
    transform: scale(0.98);
}

.record {
    align-self: flex-start;
    color: var(--text-3);
    font-size: 12px;
    animation: record-in 0.18s both;
}

@keyframes record-in {
    from {
        opacity: 0;
    }
}

.note {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

@media (max-width: 760px) {
    .dock.docked {
        top: 50%;
        left: 12px;
        width: calc(100% - 24px);
        height: calc(50% - 12px);
    }

    .work {
        top: 12px;
        right: 12px;
        bottom: calc(50% + 12px);
        left: 12px;
    }

    .picks {
        grid-template-columns: 1fr;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dock,
    .head,
    .work,
    .bar-actions {
        transition-duration: 0.01ms;
        transition-delay: 0s;
    }
}
</style>
