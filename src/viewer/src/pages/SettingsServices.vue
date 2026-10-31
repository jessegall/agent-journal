<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import DataTable from "../kit/DataTable.vue";
import {api} from "../api/client.js";
import {ago} from "../format/time.js";

// Every process the supervisors of this journal run, read again every few seconds while the tab is open: its name, its environment, whether
// it runs, since when, and its process id
const EVERY_MS = 5000;
const processes = ref([]);
let timer = 0;

async function load() {
    processes.value = (await api.supervised()).processes;
}

onMounted(() => {
    load();
    timer = setInterval(load, EVERY_MS);
});
onUnmounted(() => clearInterval(timer));

const state = (process) => (process.is_active ? "Running" : "Stopped");
const since = (process) => (process.started_at ? ago(new Date(process.started_at * 1000).toISOString()) : "");
const name = (process) => (process.front ? `${process.name} (the agent's terminal)` : process.name);
</script>

<template>
    <DataTable
        class="settings-services"
        :columns="['Process', 'Environment', 'State', 'Since', 'Process id', 'Restarts']"
        :rows="processes.map((process) => ({cells: [name(process), process.environment, state(process), since(process), process.pid > 0 ? process.pid : '', process.restarts]}))"
        empty="No supervisor answers: the journal runs no process of its own here"
    />
</template>
