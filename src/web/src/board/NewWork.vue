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
import {rows} from "../sync/rows.js";
import Suggestion from "./Suggestion.vue";
import AskedQuestion from "./AskedQuestion.vue";

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
const SKELETONS = 3;

const asked = computed(() => rows("message").filter((m) => sent.value.includes(m.data.idempotency)));
const replies = computed(() => {
    const refs = asked.value.map((m) => m.ref);
    return rows("comment").filter((c) => c.refs.some((ref) => refs.includes(ref)));
});
const boardQuestions = computed(() =>
    since.value ? rows("question").filter((q) => !q.deleted && q.refs.includes(props.board.ref) && q.created >= since.value) : []
);
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
const rowsClass = computed(() => {
    const count = Math.ceil(cards.value.length / SKELETONS);
    return `rows-${count > 2 ? "more" : count}`;
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

async function stop() {
    lastSent.value = 0;
    say(false, "Stopped. Say what you would like instead.");
    await ask("Stop drafting tickets for my last request; I will say what I want instead.");
    panel.value.focus();
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
    lines.value = [];
    sent.value = [];
    since.value = 0;
    lastSent.value = 0;
    picked.value = [];
    emit("added", keep.length);
    emit("close");
}
</script>

<template>
    <FocusStage :open="open" leave="Back to the board" @close="emit('close')">
        <TransitionGroup tag="div" name="pick" :class="['picks', rowsClass]">
            <template v-for="card in cards" :key="card.order">
                <Suggestion
                    :ticket="card.ticket"
                    :order="card.order"
                    :active="Boolean(card.ticket) && card.ticket === turn"
                    :paused="Boolean(asking)"
                    :picked="Boolean(card.ticket) && picked.includes(card.ticket.n)"
                    @toggle="toggle(card.ticket.n)"
                    @revealed="reveal(card.ticket.n)"
                />
            </template>
        </TransitionGroup>
        <ChatPanel
            ref="panel"
            v-model="words"
            :locked="adding"
            :placeholder="drafts.length ? 'Say what to change' : 'Describe the work in your own words'"
            @send="send"
        >
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
                <ChatLine thinking />
            </template>
            <template v-if="stalled">
                <ChatLine text="No answer yet. The agent may be busy with other work." />
            </template>
            <template #actions>
                <div :class="['choose', {on: writing}]">
                    <span class="note">{{ asking ? "The agent needs your answer." : "The agent is writing tickets." }}</span>
                    <template v-if="stalled">
                        <Btn small @click="askAgain">Ask again</Btn>
                    </template>
                    <Btn small @click="stop">Stop</Btn>
                </div>
                <div :class="['choose', {on: drafts.length && !writing}]">
                    <span class="note">{{ note }}</span>
                    <template v-if="missing.length">
                        <Btn small @click="pickMissing">Pick it too</Btn>
                    </template>
                    <Btn small @click="again">Try another split</Btn>
                    <Btn kind="primary" small :busy="adding" :disabled="!picked.length" @click="add">
                        {{ picked.length ? `Add ${picked.length} to ${first}` : `Add to ${first}` }}
                    </Btn>
                </div>
            </template>
        </ChatPanel>
    </FocusStage>
</template>

<style scoped>
.picks {
    display: grid;
    flex: 0 1 auto;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 200px;
    align-content: start;
    gap: 14px;
    height: 0;
    min-height: 0;
    overflow: hidden;
    padding: 4px 3px 2px;
    scrollbar-width: none;
    transition: height 0.45s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.picks.rows-1 {
    height: 206px;
}

.picks.rows-2,
.picks.rows-more {
    height: 420px;
    overflow-y: auto;
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

.choose {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 8px 0 16px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(4px);
    transition:
        opacity 0.25s,
        transform 0.25s cubic-bezier(0.2, 0.9, 0.25, 1),
        visibility 0s 0.25s;
}

.choose.on {
    opacity: 1;
    visibility: visible;
    transform: none;
    transition:
        opacity 0.25s,
        transform 0.25s cubic-bezier(0.2, 0.9, 0.25, 1),
        visibility 0s;
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
    .picks {
        grid-template-columns: 1fr;
    }

    .picks.rows-1,
    .picks.rows-2,
    .picks.rows-more {
        height: 206px;
        overflow-y: auto;
    }
}
</style>
