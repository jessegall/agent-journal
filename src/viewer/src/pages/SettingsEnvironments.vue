<script setup>
import {countsOf, envState, isActive, removeWords, STATE_WORDS, worktreeWords} from "../domain/journals.js";
import {rows} from "../sync/rows.js";
import {computed, onMounted, ref} from "vue";
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
const leftTrees = ref([]);
const loadLeftTrees = async () => (leftTrees.value = (await api.leftWorktrees()).worktrees);
onMounted(loadLeftTrees);
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
            worktree: (rows("environments").find((row) => row.id === standing.environment.id) || {}).worktree || "",
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
const droppingTree = (row) => askOf(row)?.kind === "worktree";

async function removeTree(row) {
    if (!droppingTree(row)) return say(row, "worktree", worktreeWords(row.name));
    try {
        const removed = await api.removeWorktree(row.id);
        say(row, "done", removed.line);
    } catch (error) {
        say(row, "refused", error.message);
    }
}

const treeRow = (tree) => ({id: `worktree:${tree.name}`});
const treeAsk = (tree) => askOf(treeRow(tree));

async function removeLeftTree(tree) {
    const row = treeRow(tree);
    if (treeAsk(tree)?.kind !== "worktree") return say(row, "worktree", worktreeWords(tree.name));
    try {
        say(row, "done", (await api.removeLeftWorktree(tree.name)).line);
        await loadLeftTrees();
    } catch (error) {
        say(row, "refused", error.message);
    }
}

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
                        <template v-else-if="droppingTree(row)">
                            <Btn small @click="say(row)">Keep it</Btn>
                            <Btn kind="danger" small @click="removeTree(row)">Yes, remove the worktree</Btn>
                        </template>
                        <template v-else>
                            <template v-if="row.worktree">
                                <Btn small :disabled="row.live" v-tip="row.live ? 'End the agent working in it to remove its worktree' : 'Remove this environment\'s worktree folder, keeping its branch'" @click="removeTree(row)">Remove worktree</Btn>
                            </template>
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
    <template v-if="leftTrees.length">
        <ListBox sticky title="Worktrees with no environment" :count="leftTrees.length">
            <template v-for="tree in leftTrees" :key="tree.name">
                <SettingRow :title="tree.name" :text="treeAsk(tree)?.text || `On ${tree.branch}; its environment was removed, the worktree stayed`" :alert="Boolean(treeAsk(tree))">
                    <template #control>
                        <template v-if="treeAsk(tree)?.kind === 'worktree'">
                            <Btn small @click="say(treeRow(tree))">Keep it</Btn>
                            <Btn kind="danger" small @click="removeLeftTree(tree)">Yes, remove the worktree</Btn>
                        </template>
                        <template v-else>
                            <Btn small v-tip="'Remove this worktree folder, keeping its branch'" @click="removeLeftTree(tree)">Remove worktree</Btn>
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
