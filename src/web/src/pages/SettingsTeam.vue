<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import EmptyState from "../kit/EmptyState.vue";
import TeamChatBox from "./TeamChatBox.vue";
import TeamConnect from "./TeamConnect.vue";
import TeamDevices from "./TeamDevices.vue";
import TeamInvite from "./TeamInvite.vue";
import TeamPeople from "./TeamPeople.vue";
import TeamSync from "./TeamSync.vue";
import "./team.css";

const standing = ref(null);
const outcome = ref("");
const failure = ref("");

async function load() {
    try {
        standing.value = await api.team();
    } catch (e) {
        failure.value = e.message;
    }
}

async function joined(line) {
    outcome.value = line;
    await load();
}

onMounted(load);
</script>

<template>
    <div class="team-pane">
        <template v-if="failure">
            <p class="team-failure">{{ failure }}</p>
        </template>
        <template v-else-if="!standing">
            <EmptyState loading />
        </template>
        <template v-else-if="!standing.joined">
            <TeamConnect @joined="joined" />
        </template>
        <template v-else>
            <template v-if="outcome">
                <p class="team-line">{{ outcome }}</p>
            </template>
            <TeamSync :standing="standing" />
            <TeamChatBox />
            <TeamPeople />
            <template v-if="standing.admin">
                <TeamInvite />
                <TeamDevices />
            </template>
        </template>
    </div>
</template>

<style scoped>
.team-pane {
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 640px;
}
</style>
