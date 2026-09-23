<script setup>
import {computed, ref, watch} from "vue";
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

const asked = computed(() => rows("message").filter((m) => sent.value.includes(m.data.idempotency)));
const replies = computed(() => {
    const refs = asked.value.map((m) => m.ref);
    return rows("comment").filter((c) => c.refs.some((ref) => refs.includes(ref)));
});
const conversation = computed(() =>
    [
        ...lines.value,
        ...replies.value.map((c) => ({id: c.ref, mine: false, typed: true, at: c.created, text: quoted(c.brief || c.title).text})),
    ].sort((a, b) => a.at - b.at)
);
const drafts = computed(() =>
    rows("ticket").filter(
        (t) => t.data.draft && Number(t.data.board) === props.board.n && t.created >= since.value && !t.deleted && !t.completed
    )
);
const writing = computed(() => Boolean(lastSent.value) && !replies.value.some((c) => c.created >= lastSent.value));
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
        <div class="picks">
            <template v-for="ticket in drafts" :key="ticket.n">
                <Suggestion :ticket="ticket" :picked="picked.includes(ticket.n)" @toggle="toggle(ticket.n)" />
            </template>
            <template v-if="writing">
                <Suggestion />
            </template>
        </div>
        <ChatPanel
            ref="panel"
            v-model="words"
            :grows="conversation.length + drafts.length"
            :locked="adding"
            :placeholder="drafts.length ? 'Say what to change' : 'Describe the work in your own words'"
            @send="send"
        >
            <template v-for="line in conversation" :key="line.id">
                <ChatLine :text="line.text" :mine="line.mine" :typed="line.typed" />
            </template>
            <template v-if="writing">
                <ChatLine thinking />
            </template>
            <template v-if="stalled">
                <ChatLine text="No answer yet. The agent may be busy with other work." />
            </template>
            <template #actions>
                <template v-if="writing">
                    <div class="choose">
                        <span class="note">The agent is writing tickets.</span>
                        <template v-if="stalled">
                            <Btn small @click="askAgain">Ask again</Btn>
                        </template>
                        <Btn small @click="stop">Stop</Btn>
                    </div>
                </template>
                <template v-if="drafts.length && !writing">
                    <div class="choose">
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
            </template>
        </ChatPanel>
    </FocusStage>
</template>

<style scoped>
.picks {
    display: grid;
    flex: 1;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    align-content: end;
    gap: 12px;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 2px;
}

.choose {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 4px 8px 10px 16px;
}

.note {
    flex: 1;
    min-width: 160px;
    color: var(--text-3);
    font-size: 13px;
}
</style>
