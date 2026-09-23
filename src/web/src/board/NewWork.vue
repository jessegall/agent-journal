<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import ChatLine from "../kit/ChatLine.vue";
import Btn from "../kit/Btn.vue";
import ChatPanel from "../kit/ChatPanel.vue";
import FocusStage from "../kit/FocusStage.vue";
import Turn from "../chat/Turn.vue";
import {sendMessage} from "../chat/outbox.js";
import {route} from "../route.js";
import {rows} from "../sync/rows.js";
import Suggestion from "./Suggestion.vue";

const props = defineProps({open: Boolean, board: Object});
const emit = defineEmits(["close", "added"]);
const words = ref("");
const sent = ref([]);
const since = ref(0);
const picked = ref([]);
const adding = ref(false);
const panel = ref(null);

const asked = computed(() => rows("message").filter((m) => sent.value.includes(m.data.idempotency)));
const refs = computed(() => asked.value.map((m) => m.ref));
const turns = computed(() =>
    [...asked.value, ...rows("comment").filter((c) => c.refs.some((ref) => refs.value.includes(ref)))].sort((a, b) => a.created - b.created)
);
const drafts = computed(() =>
    rows("ticket").filter(
        (t) => t.data.draft && Number(t.data.board) === props.board.n && t.created >= since.value && !t.deleted && !t.completed
    )
);
const first = computed(() => props.board.data.stages[0]);
const writing = computed(() => sent.value.length && !drafts.value.length);
const unpicked = () => drafts.value.filter((t) => !picked.value.includes(t.n));
const toggle = (n) => (picked.value = picked.value.includes(n) ? picked.value.filter((p) => p !== n) : [...picked.value, n]);
const drop = (tickets) => Promise.all(tickets.map((t) => api.act("ticket", t.n, "delete", {why: "not picked in New work"})));

watch(
    () => props.open,
    (open) => open && panel.value.focus()
);

async function send(text) {
    words.value = "";
    since.value = since.value || Date.now() / 1000 - 5;
    await drop(unpicked());
    const message = await sendMessage(route.value.env, {brief: text, about: props.board.ref});
    sent.value = [...sent.value, message.id];
}

function reset() {
    sent.value = [];
    since.value = 0;
    picked.value = [];
}

async function startOver() {
    await drop(drafts.value);
    reset();
}

async function add() {
    adding.value = true;
    const keep = picked.value;
    await Promise.all(keep.map((n) => api.act("ticket", n, "confirm")));
    await drop(unpicked());
    adding.value = false;
    reset();
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
        </div>
        <ChatPanel
            ref="panel"
            v-model="words"
            :grows="turns.length + drafts.length"
            :placeholder="drafts.length ? 'Say what to change, and the agent tries again' : 'Describe the work in your own words'"
            @send="send"
        >
            <ChatLine>What do you want to get done on {{ board.title }}?</ChatLine>
            <template v-for="turn in turns" :key="turn.ref">
                <Turn :turn="turn" />
            </template>
            <template v-if="writing">
                <ChatLine quiet>Writing tickets…</ChatLine>
            </template>
            <template #actions>
                <template v-if="drafts.length">
                    <div class="choose">
                        <span class="note">{{ picked.length ? `They go to ${first}, ready to start.` : "Pick the ones you want." }}</span>
                        <Btn small @click="startOver">Start over</Btn>
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
}

.choose {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 4px 12px 8px 16px;
}

.note {
    flex: 1;
    min-width: 160px;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
