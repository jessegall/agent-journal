<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import ListRow from "../kit/ListRow.vue";
import SidePanel from "../kit/SidePanel.vue";
import StateDot from "../kit/StateDot.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TabBar from "../kit/TabBar.vue";
import SubagentChat from "../chat/SubagentChat.vue";
import TranscriptLog from "../resource/TranscriptLog.vue";
import {useTranscript} from "../composables/transcript.js";
import {agentState, ticketOf} from "../domain/ticketAgents.js";
import {age} from "../format/time.js";
import {usePoll} from "../poll.js";
import {peekThere} from "../route.js";

const props = defineProps({
    card: {type: Object, required: true},
    env: {type: String, default: ""},
    heading: {type: String, default: ""},
    plan: {type: Number, default: 0},
});
const emit = defineEmits(["close", "terminal"]);
const EVERY = 5000;
const HISTORY = 30;

const ticket = computed(() => (props.env ? null : ticketOf(props.card.n)));
const env = computed(() => props.env || (ticket.value && ticket.value.data.work_environment) || "");
const plan = computed(() => props.plan || (ticket.value && ticket.value.data.plan) || 0);
const there = api.in(() => env.value);
const state = computed(() => agentState(props.card));

const agent = ref(null);
const newest = (list) => [...list].sort((a, b) => b.updated - a.updated)[0] || null;
const own = (list) =>
    list.find((row) => row.title === props.card.session) || newest(list.filter((row) => !row.deleted && !row.data.parent));
usePoll(
    `ticket-agent:${props.card.n}`,
    () => (env.value ? there.list("agent", {last: 20, completed: true}) : Promise.resolve(null)),
    EVERY,
    (got) => got && (agent.value = own(got.rows))
);

const works = ref([]);
usePoll(
    `ticket-agent-work:${props.card.n}`,
    () => (env.value ? there.list("work", {last: HISTORY, completed: true}) : Promise.resolve(null)),
    EVERY,
    (got) => got && (works.value = [...got.rows].filter((w) => !w.deleted).sort((a, b) => b.created - a.created))
);

const log = ref(null);
const scroller = computed(() => log.value && log.value.scroller);
const transcript = useTranscript(() => (agent.value ? agent.value.n : 0), "", scroller, there);
const {turns} = transcript;

const tab = ref("chat");
const tabs = computed(() => [
    {key: "chat", title: "Chat"},
    {key: "transcript", title: "Transcript"},
    {key: "history", title: "History", count: works.value.length},
]);
</script>

<template>
    <SidePanel :title="heading || `#${card.n} ${card.title}`" width="wide" @close="emit('close')">
        <template #actions>
            <template v-if="plan && env">
                <Btn small @click="peekThere(env, 'plan', plan)">Open its plan</Btn>
            </template>
            <Btn small title="The agent's live terminal, where you can type to it" @click="emit('terminal')">Open its terminal</Btn>
        </template>
        <div class="ticket-agent">
            <div :class="['now', state.key]">
                <StateDot :state="state.dot" />
                <span class="word">{{ state.word }}</span>
                <span class="reason">{{ card.reason }}</span>
            </div>
            <p class="where">
                {{ agent ? `Agent ${agent.n}` : "Its agent" }} in {{ env || "the ticket's environment" }}. You are only reading here.
            </p>
            <TabBar v-model="tab" :tabs="tabs" />
            <SwitchCase :value="tab">
                <template #chat>
                    <SubagentChat class="chat" :turns="turns" :session="card.session" read-only />
                </template>
                <template #transcript>
                    <TranscriptLog ref="log" :transcript="transcript" :entries="turns" :env="env" />
                </template>
                <template #history>
                    <template v-if="!works.length">
                        <EmptyState title="No work logged yet">What its agent starts and finishes shows here.</EmptyState>
                    </template>
                    <div class="history">
                        <template v-for="w in works" :key="w.n">
                            <ListRow :kind="w.completed ? 'Done' : 'Working'" :title="w.title" :text="age(w.completed || w.created)" />
                        </template>
                    </div>
                </template>
            </SwitchCase>
        </div>
    </SidePanel>
</template>

<style scoped>
.ticket-agent {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.now {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
}

.word {
    flex: none;
    color: var(--text);
    font-weight: 500;
}

.now.waiting .word {
    color: var(--tone-warn);
}

.now.stuck .word {
    color: var(--danger);
}

.reason {
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.where {
    margin: -4px 0 0;
    color: var(--text-3);
    font-size: 12px;
}

.chat {
    max-height: 62vh;
}

.history {
    display: flex;
    flex-direction: column;
}
</style>
