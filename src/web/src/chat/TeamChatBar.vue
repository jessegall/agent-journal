<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import {pollKey, usePoll} from "../composables/poll.js";
import Btn from "../kit/Btn.vue";

const EVERY_MS = 10000;
const line = ref("");
const failed = ref("");
const refresh = usePoll(pollKey(), () => api.teamChat(), EVERY_MS, (got) => got && (line.value = got.line || ""));

async function claim() {
    failed.value = "";
    try {
        const got = await api.claimTeamChat();
        line.value = got.line || "";
    } catch (refused) {
        failed.value = refused.message;
    }
    refresh();
}
</script>

<template>
    <div class="agent-bar team-chat-bar">
        <span class="team-chat-holder">{{ failed || line }}</span>
        <template v-if="!line.startsWith('Held by') || line.includes('offline')">
            <Btn class="team-chat-claim" @click="claim">Claim</Btn>
        </template>
    </div>
</template>

<style scoped>
.team-chat-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 34px;
    padding: 0 14px;
    font-size: 11.5px;
    color: var(--text-2);
}

.team-chat-holder {
    flex: 1;
    min-width: 0;
}
</style>
