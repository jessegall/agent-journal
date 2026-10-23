<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import ListBox from "../kit/ListBox.vue";
import {href} from "../route.js";
import {choose} from "../state/environment.js";
import "./team.css";

const TEAM_CHAT = "team";
const chat = ref(null);
const busy = ref(false);
const failure = ref("");
const offline = computed(() => chat.value && chat.value.claimable && chat.value.holder);

async function load() {
    try {
        chat.value = await api.teamChat();
    } catch (e) {
        failure.value = e.message;
    }
}

async function act(call) {
    busy.value = true;
    failure.value = "";
    try {
        chat.value = await call();
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}

onMounted(load);
</script>

<template>
    <ListBox title="Team chat">
        <div class="team-block">
            <template v-if="chat">
                <div class="team-chat-row">
                    <span class="team-chat-line">{{ chat.line }}</span>
                    <template v-if="chat.mine">
                        <Btn small :busy="busy" @click="act(() => api.releaseTeamChat())">Release</Btn>
                    </template>
                    <template v-else-if="chat.claimable">
                        <Btn small :busy="busy" @click="act(() => api.claimTeamChat())">Claim</Btn>
                    </template>
                    <Btn small :href="href.page()" @click="choose(TEAM_CHAT)">Open <Icon name="chevronRight" /></Btn>
                </div>
                <template v-if="chat.mine">
                    <p class="team-fine">Its agent runs on this machine. Release stops it after its files are committed and pushed.</p>
                </template>
                <template v-else-if="offline">
                    <p class="team-fine">Whatever {{ chat.holder }} had not pushed stays on {{ chat.holder }}'s machine. The new agent starts from the chat's latest messages.</p>
                </template>
            </template>
            <template v-if="failure">
                <p class="team-failure">{{ failure }}</p>
            </template>
        </div>
    </ListBox>
</template>

<style scoped>
.team-chat-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
}

.team-chat-line {
    flex: 1 1 240px;
    color: var(--text);
}
</style>
