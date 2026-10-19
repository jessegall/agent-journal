<script setup>
import {countsOf, envState, isActive, removeWords, STATE_WORDS} from "../domain/journals.js";
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import IconCount from "../kit/IconCount.vue";
import ListBox from "../kit/ListBox.vue";
import SettingRow from "../kit/SettingRow.vue";
import StatusLabel from "../kit/StatusLabel.vue";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {matches} from "../domain/settingsCatalog.js";

const props = defineProps({query: {type: String, default: ""}});
const ask = ref({});
const here = (name) => name === route.value.env;

const envRows = computed(() =>
    ((store.summary && store.summary.environments) || [])
        .map((standing) => ({
            standing,
            id: standing.environment.id,
            name: standing.environment.name,
            live: Boolean(standing.agent),
            state: envState(standing),
            counts: countsOf(standing),
            work: standing.task ? `· ${standing.task.title}` : "",
        }))
        .filter((row) => matches(`${row.name} environment`, props.query))
        .sort((a, b) => here(b.name) - here(a.name) || a.name.localeCompare(b.name))
);
const groups = computed(() =>
    [
        {key: "running", title: "Agent running", rows: envRows.value.filter((row) => row.live)},
        {key: "quiet", title: "No agent running", rows: envRows.value.filter((row) => !row.live)},
    ].filter((group) => group.rows.length)
);

const askOf = (row) => ask.value[row.id] || null;
const say = (row, kind = "", text = "") => (ask.value = {...ask.value, [row.id]: kind ? {kind, text} : null});
const confirming = (row) => ["remove", "refused"].includes(askOf(row)?.kind);

async function remove(row) {
    if (!confirming(row)) return say(row, "remove", removeWords(row.standing.environment, row.live));
    try {
        await api.removeEnvironment(row.id);
        say(row);
    } catch (error) {
        say(row, "refused", error.message);
    }
}
</script>

<template>
    <template v-for="group in groups" :key="group.key">
        <ListBox sticky :title="group.title" :count="group.rows.length">
            <template v-for="row in group.rows" :key="row.id">
                <SettingRow :title="row.name" :tag="here(row.name) ? 'You are here' : ''" :text="askOf(row) ? askOf(row).text : ''" :alert="Boolean(askOf(row))">
                    <template #sub>
                        <StatusLabel :state="row.state" :lit="isActive(row.state)" :note="row.work">
                            {{ STATE_WORDS[row.state] }}
                        </StatusLabel>
                    </template>
                    <template v-for="c in row.counts" :key="c.key">
                        <IconCount :icon="c.icon" :count="c.n" :label="c.n === 1 ? c.one : c.many" :hot="c.hot" />
                    </template>
                    <template #control>
                        <template v-if="confirming(row)">
                            <Btn small @click="say(row)">Keep it</Btn>
                            <Btn kind="danger" small @click="remove(row)">Yes, remove</Btn>
                        </template>
                        <template v-else>
                            <Btn
                                kind="danger"
                                small
                                :disabled="here(row.name)"
                                v-tip="here(row.name) ? 'Switch to another environment to remove this one' : 'Remove this environment'"
                                @click="remove(row)"
                            >
                                Remove environment
                            </Btn>
                        </template>
                    </template>
                </SettingRow>
            </template>
        </ListBox>
    </template>
    <template v-if="!envRows.length">
        <EmptyState class="settings-environments-empty" :loading="!store.summary">
            {{ query.trim() ? "No environment matches." : "There are no environments yet." }}
        </EmptyState>
    </template>
</template>

<style scoped>
.settings-environments-empty {
    padding: 24px 16px;
}
</style>
