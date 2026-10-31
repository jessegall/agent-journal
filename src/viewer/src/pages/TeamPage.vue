<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {useAttempt} from "../composables/attempt.js";
import AlertDialog from "../kit/AlertDialog.vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Segmented from "../kit/Segmented.vue";
import StateDot from "../kit/StateDot.vue";
import LibraryItems from "../resource/LibraryItems.vue";
import TeamConnectForm from "../resource/TeamConnectForm.vue";
import TeamMembers from "../resource/TeamMembers.vue";
import TeamServerSetup from "../resource/TeamServerSetup.vue";
import "./team.css";

// The Team page: with no team connected, connect to a server or set one up; with teams, pick one and see as whom, its
// people, devices, invitations and shared items; add a team or disconnect one
const {busy, failure, attempt} = useAttempt();
const teams = ref(null);
const chosen = ref("");
const adding = ref(false);
const leaving = ref("");

const entry = computed(() => teams.value?.find((t) => t.team === chosen.value));
const choices = computed(() => (teams.value || []).map((t) => ({key: t.team, label: t.team})));
const connecting = computed(() => adding.value || !teams.value?.length);

async function load() {
    teams.value = (await api.teams()).teams;
    if (!entry.value) chosen.value = teams.value[0]?.team || "";
}

async function connected(team) {
    adding.value = false;
    chosen.value = team;
    await attempt(load);
}

const disconnect = () => attempt(async () => (await api.disconnectTeam(leaving.value), (leaving.value = ""), await load()));

onMounted(() => attempt(load));
</script>

<template>
    <section class="team-page">
        <header class="team-head">
            <h1>Team</h1>
            <p class="team-plain">Your teams' servers: their people, their devices, and the sequences, templates, profiles, readers, skills, documents, files and plans each team shares.</p>
        </header>
        <template v-if="failure">
            <p class="team-failure">{{ failure }}</p>
        </template>
        <template v-if="!teams">
            <EmptyState loading />
        </template>
        <template v-else-if="connecting">
            <div class="team-choices-side">
                <div class="team-card">
                    <TeamConnectForm @connected="connected">
                        <template v-if="adding">
                            <Btn @click="adding = false">Cancel</Btn>
                        </template>
                    </TeamConnectForm>
                </div>
                <div class="team-card">
                    <TeamServerSetup />
                </div>
            </div>
        </template>
        <template v-else>
            <div class="team-where">
                <Segmented :options="choices" :value="chosen" @pick="chosen = $event" />
                <Btn @click="adding = true">Add a team</Btn>
            </div>
            <div class="team-where">
                <p class="team-status">
                    <StateDot state="done" />
                    <span>Connected to {{ entry.address }} as {{ entry.name }}, {{ entry.role }}</span>
                </p>
                <Btn :busy="busy" @click="leaving = chosen">Disconnect from {{ chosen }}</Btn>
            </div>
            <TeamMembers :key="chosen" :entry="entry" />
            <section class="team-shared">
                <h2 class="team-section">Shared items</h2>
                <LibraryItems :key="chosen" :team="chosen" />
            </section>
            <template v-if="leaving">
                <Teleport to="body">
                    <AlertDialog :title="`Disconnect from ${leaving}?`">
                        <p>The other teams stay connected, and what you imported from its library stays.</p>
                        <template #actions>
                            <Btn @click="leaving = ''">Stay connected</Btn>
                            <Btn kind="danger" :busy="busy" @click="disconnect">Disconnect</Btn>
                        </template>
                    </AlertDialog>
                </Teleport>
            </template>
        </template>
    </section>
</template>

<style scoped>
.team-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1200px;
    padding: 24px;
}

.team-head h1 {
    margin: 0 0 6px;
    font-size: 20px;
}

.team-head .team-plain {
    max-width: 640px;
}

.team-choices-side {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: 20px;
}

.team-card {
    border: 1px solid var(--border-3);
    border-radius: 8px;
}

.team-where {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.team-shared {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.team-section {
    margin: 0;
}

@media (max-width: 760px) {
    .team-choices-side {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
