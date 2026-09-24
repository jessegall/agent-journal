<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import IconCount from "../kit/IconCount.vue";
import ListBox from "../kit/ListBox.vue";
import SettingRow from "../kit/SettingRow.vue";
import StatusLabel from "../kit/StatusLabel.vue";
import {STATE_WORDS, countsOf, envState, focusOf} from "../sync/hub.js";
import {usePoll} from "../poll.js";
import {polled} from "../sync/polled.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {matches} from "./featureSettings.js";

const props = defineProps({query: {type: String, default: ""}});
const summary = ref(null);
const pending = ref({});
const refused = ref({});
const sweeping = ref({});

usePoll(
    "settings-summary",
    () => api.summary(),
    5000,
    (got) => (summary.value = got)
);
usePoll(...polled.online);

const summaryOf = (name) => ((summary.value && summary.value.environments) || []).find((e) => e.name === name) || null;
const live = (name) => store.online.some((agent) => agent.environment === name);
const here = (e) => e.title === route.value.env;

const envRows = computed(() =>
    rows("environment")
        .filter((e) => !e.completed)
        .map((e) => {
            const got = summaryOf(e.title);
            return {
                env: e,
                live: live(e.title),
                state: !live(e.title) ? "stopped" : got ? envState(got) : "busy",
                work: got && focusOf(got).known ? focusOf(got) : null,
                counts: got ? countsOf(got.counts) : [],
            };
        })
        .filter((row) => matches(`${row.env.title} environment`, props.query))
        .sort((a, b) => here(b.env) - here(a.env) || b.live - a.live || a.env.title.localeCompare(b.env.title))
);
const working = computed(() => envRows.value.filter((row) => row.live).length);

function textOf(row) {
    const e = row.env;
    if (refused.value[e.n]) return refused.value[e.n];
    if (pending.value[e.n]) return pending.value[e.n];
    if (sweeping.value[e.n]) return sweeping.value[e.n];
    if (here(e)) return "You are in this environment. Switch to another one to remove it.";
    return row.work ? `${row.work.current ? "Working on" : "Last finished"}: ${row.work.title}` : "";
}

function keep(e) {
    pending.value = {...pending.value, [e.n]: ""};
    refused.value = {...refused.value, [e.n]: ""};
}

async function remove(row) {
    const e = row.env;
    if (row.live && !pending.value[e.n]) {
        pending.value = {
            ...pending.value,
            [e.n]: "An agent is running in this environment. Press Remove anyway to remove it all the same.",
        };
        return;
    }
    try {
        await api.act("environment", e.n, "remove", {how: "removed from the viewer", ...(refused.value[e.n] ? {yes: true} : {})});
        keep(e);
    } catch (error) {
        refused.value = {...refused.value, [e.n]: error.message};
    }
}

async function sweep(e) {
    const reply = await api.act("environment", e.n, "sweep", sweeping.value[e.n] ? {yes: true} : {});
    sweeping.value = {...sweeping.value, [e.n]: sweeping.value[e.n] ? "" : reply};
}

const asking = (e) => Boolean(pending.value[e.n] || refused.value[e.n]);
</script>

<template>
    <ListBox
        sticky
        title="Environments"
        :count="working ? `${envRows.length} · ${working} with an agent running` : envRows.length"
        lead="Remove packs an environment's whole record into the attic; journal environment unarchive with its name brings it back. Sweep packs its messages, comments, reactions, notifications and closed rows into the attic and keeps what is still true."
    >
        <template v-for="row in envRows" :key="row.env.n">
            <SettingRow :title="row.env.title" :text="textOf(row)" :tag="here(row.env) ? 'You are here' : ''">
                <StatusLabel :state="row.state">{{ STATE_WORDS[row.state] }}</StatusLabel>
                <template v-for="c in row.counts" :key="c.key">
                    <IconCount :icon="c.icon" :count="c.n" :label="c.n === 1 ? c.one : c.many" :hot="c.hot" />
                </template>
                <template #control>
                    <template v-if="asking(row.env)">
                        <Btn small @click="keep(row.env)">Keep it</Btn>
                    </template>
                    <template v-else>
                        <Btn small @click="sweep(row.env)">{{ sweeping[row.env.n] ? "Sweep now" : "Sweep" }}</Btn>
                    </template>
                    <Btn kind="danger" small :disabled="here(row.env)" @click="remove(row)">
                        {{ asking(row.env) ? "Remove anyway" : "Remove" }}
                    </Btn>
                </template>
            </SettingRow>
        </template>
        <template v-if="!envRows.length">
            <EmptyState class="settings-environments-empty">No environment matches.</EmptyState>
        </template>
    </ListBox>
</template>

<style scoped>
.settings-environments-empty {
    padding: 24px 16px;
}
</style>
