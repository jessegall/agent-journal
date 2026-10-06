<script setup>
import {agentRunningIn} from "../composables/settings.js";
import {countsOf, envState, focusOf, isActive, STATE_WORDS} from "../domain/journals.js";
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import IconCount from "../kit/IconCount.vue";
import ListBox from "../kit/ListBox.vue";
import SettingRow from "../kit/SettingRow.vue";
import StatusLabel from "../kit/StatusLabel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {matches} from "../domain/settingsCatalog.js";

const props = defineProps({query: {type: String, default: ""}});
const summary = computed(() => store.summary);
const ask = ref({});

const summaryOf = (name) => ((summary.value && summary.value.environments) || []).find((e) => e.name === name) || null;
const here = (e) => e.title === route.value.env;

const envRows = computed(() =>
    rows("environment")
        .filter((e) => !e.completed)
        .map((e) => {
            const got = summaryOf(e.title);
            return {
                env: e,
                n: e.n,
                title: e.title,
                live: agentRunningIn(e.title),
                state: !agentRunningIn(e.title) ? "stopped" : got ? envState(got) : "busy",
                work: got && focusOf(got).known ? focusOf(got) : null,
                counts: got ? countsOf(got.counts) : [],
            };
        })
        .filter((row) => matches(`${row.title} environment`, props.query))
        .sort((a, b) => here(b.env) - here(a.env) || a.env.title.localeCompare(b.env.title))
);
const groups = computed(() =>
    [
        {key: "running", title: "Agent running", rows: envRows.value.filter((row) => row.live)},
        {key: "quiet", title: "No agent running", rows: envRows.value.filter((row) => !row.live)},
    ].filter((group) => group.rows.length)
);

const askOf = (e) => ask.value[e.n] || null;
const kindOf = (e) => (askOf(e) ? askOf(e).kind : "");
const say = (e, kind = "", text = "") => (ask.value = {...ask.value, [e.n]: kind ? {kind, text} : null});
const confirming = (e) => ["remove", "refused"].includes(kindOf(e));
const stepOf = (e) => (confirming(e) ? "remove" : kindOf(e) === "sweep" ? "sweep" : "idle");

const workNote = (row) => (row.work ? `· ${row.work.current ? "" : "last closed "}${row.work.title}` : "");

const removeWords = (row) =>
    [
        row.live ? "An agent is running here." : "",
        `Removing moves all of ${row.title} into the archive.`,
        `Bring it back with journal environment unarchive ${row.title}.`,
    ]
        .filter(Boolean)
        .join(" ");

function sweepWords(reply) {
    const found = /packs (.+) into the attic/.exec(String(reply));
    if (!found) return String(reply);
    if (found[1] === "nothing") return "There is nothing to archive.";
    return `Archiving moves ${found[1]} into the archive. Facts, rules, reminders, docs and open work stay.`;
}

const sentence = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1) + ".";

async function remove(row) {
    const e = row.env;
    if (!confirming(e)) return say(e, "remove", removeWords(row));
    try {
        await api.removeEnvironment(e.n, kindOf(e) === "refused");
        say(e);
    } catch (error) {
        say(e, "refused", error.message);
    }
}

async function sweep(e) {
    const now = kindOf(e) === "sweep";
    try {
        const reply = await api.sweepEnvironment(e.n, now);
        say(e, now ? "done" : "sweep", now ? sentence(reply) : sweepWords(reply));
    } catch (error) {
        say(e, "failed", error.message);
    }
}

const empty = (e) => kindOf(e) === "sweep" && askOf(e).text === "There is nothing to archive.";
</script>

<template>
    <template v-for="group in groups" :key="group.key">
        <ListBox sticky :title="group.title" :count="group.rows.length">
            <template v-for="row in group.rows" :key="row.n">
                <SettingRow
                    :title="row.title"
                    :tag="here(row.env) ? 'You are here' : ''"
                    :text="askOf(row.env) ? askOf(row.env).text : ''"
                    :alert="Boolean(askOf(row.env)) && kindOf(row.env) !== 'done'"
                >
                    <template #sub>
                        <StatusLabel :state="row.state" :lit="isActive(row.state)" :note="workNote(row)">
                            {{ STATE_WORDS[row.state] }}
                        </StatusLabel>
                    </template>
                    <template v-for="c in row.counts" :key="c.key">
                        <IconCount :icon="c.icon" :count="c.n" :label="c.n === 1 ? c.one : c.many" :hot="c.hot" />
                    </template>
                    <template #control>
                        <SwitchCase :value="stepOf(row.env)">
                            <template #remove>
                                <Btn small @click="say(row.env)">Keep it</Btn>
                                <Btn kind="danger" small @click="remove(row)">
                                    {{ row.live || kindOf(row.env) === "refused" ? "Archive anyway" : "Yes, archive" }}
                                </Btn>
                            </template>
                            <template #sweep>
                                <Btn small @click="say(row.env)">{{ empty(row.env) ? "Close" : "Cancel" }}</Btn>
                                <template v-if="!empty(row.env)">
                                    <Btn kind="primary" small @click="sweep(row.env)">Archive now</Btn>
                                </template>
                            </template>
                            <template #idle>
                                <Btn small title="Moves old messages and closed items into the archive" @click="sweep(row.env)">
                                    Archive old items
                                </Btn>
                                <Btn
                                    kind="danger"
                                    small
                                    :disabled="here(row.env)"
                                    :title="
                                        here(row.env)
                                            ? 'Switch to another environment to archive this one'
                                            : 'Move this environment into the archive'
                                    "
                                    @click="remove(row)"
                                >
                                    Archive environment
                                </Btn>
                            </template>
                        </SwitchCase>
                    </template>
                </SettingRow>
            </template>
        </ListBox>
    </template>
    <template v-if="!envRows.length">
        <EmptyState class="settings-environments-empty">
            {{ query.trim() ? "No environment matches." : "There are no environments yet." }}
        </EmptyState>
    </template>
</template>

<style scoped>
.settings-environments-empty {
    padding: 24px 16px;
}
</style>
