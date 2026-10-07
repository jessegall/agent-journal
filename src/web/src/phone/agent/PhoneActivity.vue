<script setup>
import {computed, ref} from "vue";
import {api} from "../../api/client.js";
import {counted, useActivity} from "../../composables/activity.js";
import {pollKey, usePoll} from "../../composables/poll.js";
import {currentWork, lineOf, stateOf, wordOf} from "../../domain/agentState.js";
import {store} from "../../state/store.js";
import {age} from "../../format/time.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import PhonePage from "../settings/PhonePage.vue";
import {useLeadAgent} from "./lead.js";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const EVERY = 4000;
const SHOWN = 100;
const UNREACHED = new Set(["agent", "nudge", "phone", "share", "plugin"]);
const events = ref([]);
const loaded = ref(false);
const rows = ref(new Map());
const works = ref([]);
const {agent} = useLeadAgent();
const find = (key) => rows.value.get(key) || null;
const {items, unfold, heading, title, who} = useActivity(events, find);
const work = computed(() => currentWork(works.value));
const now = computed(() => `${wordOf(stateOf(agent.value, works.value))}: ${lineOf(agent.value, works.value)}`);
const reachable = (e) => Boolean(store.spec && store.spec.types[e.type]) && !UNREACHED.has(e.type);

async function titled(got) {
    const wanted = Object.groupBy(
        got.filter((e) => store.spec && store.spec.types[e.type] && !rows.value.has(`${e.type}:${e.n}`)),
        (e) => e.type
    );
    const lists = await Promise.all(
        Object.entries(wanted).map(([type, of]) => api.list(type, {completed: true, only: [...new Set(of.map((e) => e.n))]}).catch(() => ({rows: []})))
    );
    const next = new Map(rows.value);
    lists.flatMap((list) => list.rows || []).forEach((row) => next.set(`${row.type}:${row.n}`, row));
    rows.value = next;
}

async function ask() {
    const [got, open] = await Promise.all([api.recentEvents(SHOWN), api.list("work", {last: 5})]);
    await titled(got);
    return {got, open: open.rows || []};
}

usePoll(pollKey(), ask, EVERY, ({got, open}) => {
    events.value = got;
    works.value = open;
    loaded.value = true;
});
</script>

<template>
    <PhonePage title="Activity" line="What happened in the journal, newest first." :back="back" @back="emit('back')">
        <CellGroup head="The agent now">
            <Cell icon="work" label="The agent" :sub="now" :still="!work" @pick="emit('open', `work:${work.n}`)" />
        </CellGroup>
        <template v-if="loaded && !items.length">
            <EmptyList icon="activity" title="Nothing happened yet" reason="Changes the agent and you make show here." />
        </template>
        <CellGroup head="Activity">
            <template v-for="item in items" :key="item.key">
                <template v-if="item.fold">
                    <Cell
                        :label="counted(item.fold.events)"
                        :sub="age(item.fold.events[0].at) || 'just now'"
                        :chevron="false"
                        @pick="unfold(item.key)"
                    />
                </template>
                <template v-else>
                    <Cell
                        :label="`${heading(item.event)} ${item.event.n}`"
                        :sub="`${who(item.event)} · ${age(item.event.at) || 'just now'}`"
                        :indent="item.nested ? 1 : 0"
                        :still="!reachable(item.event)"
                        @pick="emit('open', `${item.event.type}:${item.event.n}`)"
                    >
                        <template v-if="title(item.event)">
                            <span class="activity-title">{{ title(item.event) }}</span>
                        </template>
                    </Cell>
                </template>
            </template>
        </CellGroup>
    </PhonePage>
</template>

<style scoped>
.activity-title {
    display: -webkit-box;
    overflow: hidden;
    margin-top: 2px;
    color: var(--text-2);
    font-size: 0.875rem;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>
