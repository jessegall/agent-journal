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

const props = defineProps({open: Boolean, board: Object});
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
const first = computed(() => props.board.data.stages[0]);
const unpicked = () => drafts.value.filter((t) => !picked.value.includes(t.n));
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
    await drop(unpicked());
    const message = await sendMessage(route.value.env, {brief: text, about: props.board.ref, newWork: true});
    sent.value = [...sent.value, message.id];
}

async function again() {
    await drop(unpicked());
    say(false, "What should I do differently?");
    panel.value.focus();
}

async function add() {
    adding.value = true;
    const keep = picked.value;
    await Promise.all(keep.map((n) => api.act("ticket", n, "confirm")));
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
            <template #actions>
                <template v-if="drafts.length && !writing">
                    <div class="choose">
                        <span class="note">{{ picked.length ? `They go to ${first}, ready to start.` : "Click a card to keep it." }}</span>
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
