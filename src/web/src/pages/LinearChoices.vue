<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import {saveSettings} from "../actions/settings.js";
import {boardOf, keyOf, teamsOf, withTeam} from "../domain/integrations.js";
import ChoiceList from "../kit/ChoiceList.vue";
import Switch from "../kit/Switch.vue";
import {rows} from "../sync/rows.js";
import {store} from "../state/store.js";

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

const pickBoard = (n) => saveSettings({[NAME]: {board: n}});
const pickTeam = (id, on) => saveSettings({[NAME]: {teams: withTeam(picked.value, id, on)}});
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

.team {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
