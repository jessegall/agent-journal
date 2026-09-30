<script setup>
import {inject, ref} from "vue";
import {phone} from "../api/phone.js";
import Btn from "../kit/Btn.vue";

defineProps({running: Boolean});
const failed = inject("phoneFailed");
const refresh = inject("phoneRefresh", () => {});
const asking = ref(false);
const stopping = ref(false);
const told = ref("");

async function stop() {
    stopping.value = true;
    try {
        await phone.stop();
        told.value = "The agent is ending its session.";
        refresh();
    } catch (error) {
        if (error.status === 422) told.value = error.message;
        else failed(error);
    } finally {
        stopping.value = false;
        asking.value = false;
    }
}
</script>

<template>
    <div class="agent">
        <span :class="['agent-state', {running}]">
            <span class="agent-dot" />
            {{ running ? "Agent running" : "No agent running" }}
        </span>
        <template v-if="running && !asking">
            <Btn small @click="asking = true">Stop</Btn>
        </template>
    </div>
    <template v-if="asking">
        <div class="agent-ask">
            <span>Stop the agent? It ends its session; you can start it again from your computer.</span>
            <Btn kind="primary" large :busy="stopping" @click="stop">Yes, stop it</Btn>
            <Btn large @click="asking = false">Keep it running</Btn>
        </div>
    </template>
    <template v-if="told">
        <p class="agent-told">{{ told }}</p>
    </template>
</template>

<style scoped>
.agent {
    display: flex;
    align-items: center;
    gap: 10px;
}

.agent-state {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 13px;
}

.agent-state.running {
    color: var(--text-2);
}

.agent-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-4);
}

.running .agent-dot {
    background: var(--tone-good);
}

.agent-ask,
.agent-told {
    flex-basis: 100%;
}

.agent-ask {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 0 12px;
    color: var(--text-2);
}

.agent-told {
    margin: 0 0 10px;
    color: var(--text-2);
    font-size: 14px;
}
</style>
