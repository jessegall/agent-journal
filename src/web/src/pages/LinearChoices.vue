<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import {saveSettings} from "../actions/settings.js";
import {boardOf, keyOf, mapped, settingsWith, stageStatesOf, statesFor, teamsOf, withStageState, withTeam} from "../domain/integrations.js";
import ChoiceList from "../kit/ChoiceList.vue";
import MenuChoice from "../kit/MenuChoice.vue";
import Switch from "../kit/Switch.vue";
import {rows} from "../sync/rows.js";
import {store} from "../state/store.js";

const props = defineProps({states: {type: Array, default: () => []}});
const NAME = "linear";
const boards = computed(() => rows("board").filter((row) => !row.deleted));
const board = computed(() => boardOf(store.settings, NAME));
const picked = computed(() => teamsOf(store.settings, NAME));
const choices = computed(() => boards.value.map((row) => ({value: row.n, label: row.title, current: row.n === board.value})));
const teams = ref([]);
const failure = ref("");
const key = computed(() => keyOf(store.settings, NAME));

async function load() {
    failure.value = "";
    if (!key.value) {
        teams.value = [];
        return;
    }
    try {
        teams.value = await api.integrationTeams(NAME);
    } catch (error) {
        teams.value = [];
        failure.value = error.message;
    }
}

watch(key, load, {immediate: true});

const stages = computed(() => boards.value.find((row) => row.n === board.value)?.data.stages || []);
const options = computed(() => statesFor(props.states, picked.value));
const stageStates = computed(() => stageStatesOf(store.settings, NAME));
const hasMapping = computed(() => mapped(store.settings, NAME));
const sending = computed(() => Boolean(store.settings?.[NAME]?.send_status));
const pickState = (stage, state) => saveSettings(settingsWith(store.settings, NAME, {stage_states: withStageState(store.settings, NAME, stage, state)}));
const sendStatus = (on) => saveSettings(settingsWith(store.settings, NAME, {send_status: on}));
const pickBoard = (n) => saveSettings(settingsWith(store.settings, NAME, {board: n}));
const pickTeam = (id, on) => saveSettings(settingsWith(store.settings, NAME, {teams: withTeam(picked.value, id, on)}));
</script>

<template>
    <div class="choices">
        <h4 class="label">Board</h4>
        <template v-if="boards.length">
            <ChoiceList stacked :choices="choices" @pick="pickBoard" />
        </template>
        <template v-else>
            <p class="line">You have no board yet. Make one on the Board page.</p>
        </template>
        <h4 class="label">Which issues</h4>
        <p class="line">The issues assigned to you in these teams. None picked means every team.</p>
        <template v-if="!key">
            <p class="line">Pick a key to see the teams.</p>
        </template>
        <template v-else-if="failure">
            <p class="line">{{ failure }}</p>
        </template>
        <template v-for="team in teams" :key="team.id">
            <div class="team">
                <span>{{ team.name }}</span>
                <Switch :on="picked.includes(team.id)" :title="team.name" @change="(on) => pickTeam(team.id, on)" />
            </div>
        </template>
        <h4 class="label">Status</h4>
        <template v-if="!stages.length">
            <p class="line">Pick a board to map its stages to Linear states.</p>
        </template>
        <template v-else-if="!options.length">
            <p class="line">The states Linear has show here after the first check.</p>
        </template>
        <template v-for="stage in stages" :key="stage">
            <div class="team">
                <span>When a ticket moves to {{ stage }}, set the issue to</span>
                <MenuChoice :options="options" :value="stageStates[stage] || ''" empty="Do nothing" @pick="(state) => pickState(stage, state)" />
            </div>
        </template>
        <div :class="['team', {greyed: !hasMapping}]">
            <span>Send status changes to Linear</span>
            <Switch :on="sending" title="Send status changes to Linear" @change="sendStatus" />
        </div>
        <template v-if="!hasMapping">
            <p class="line">Map a stage first.</p>
        </template>
    </div>
</template>

<style scoped>
.choices {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.label {
    margin: 4px 0 0;
    font-size: 12px;
    font-weight: 600;
}

.line {
    margin: 0;
    color: var(--text-2);
}

.greyed {
    opacity: 0.5;
    pointer-events: none;
}

.team {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
