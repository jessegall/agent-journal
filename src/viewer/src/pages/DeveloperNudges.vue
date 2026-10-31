<script setup>
import DataTable from "../kit/DataTable.vue";
import {onMounted, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";

const agents = ref([]);
let timer = null;

async function load() {
    agents.value = (await api.developerNudges()).agents;
}

onMounted(() => {
    load();
    timer = setInterval(load, 5000);
});
onUnmounted(() => clearInterval(timer));

async function reset() {
    agents.value = (await api.developerNudgesReset()).agents;
}

const clock = (seconds) => new Date(seconds * 1000).toLocaleString([], {month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"});
</script>

<template>
    <section class="developer-nudges" data-developer-nudges>
        <div class="developer-head">
            <h3 class="developer-heading">Nudges sent to each agent</h3>
            <button class="developer-reset" type="button" @click="reset">Reset the counts</button>
        </div>
        <template v-if="!agents.length">
            <p class="developer-line">No nudge has been sent since the last reset.</p>
        </template>
        <template v-for="agent in agents" :key="agent.session">
            <h4 class="developer-agent">{{ agent.agent }}</h4>
            <DataTable
                :columns="['Nudge', 'Times sent', 'Last sent']"
                :rows="agent.nudges.map((nudge) => ({cells: [nudge.key, nudge.count, clock(nudge.last_at)]}))"
                empty="No nudge sent"
            />
        </template>
    </section>
</template>

<style scoped>
.developer-nudges {
    margin: 0 0 24px;
}

.developer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0 0 6px;
}

.developer-heading {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
}

.developer-agent {
    margin: 12px 0 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-2);
}

.developer-reset {
    padding: 4px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.developer-reset:hover {
    background: var(--hover);
}

.developer-line {
    margin: 0 0 12px;
    color: var(--text);
    opacity: 0.7;
    font-size: 13px;
}
</style>
