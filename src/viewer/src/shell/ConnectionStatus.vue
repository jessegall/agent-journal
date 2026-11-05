<script setup>
import {computed, ref} from "vue";
import {usePoll} from "../../kit/usePoll.js";
import {transport} from "../api/transport.js";

const status = ref("unknown");
const labels = {unknown: "Checking", online: "Online", offline: "Offline"};
const label = computed(() => labels[status.value]);

async function readConnection() {
    try {
        const answer = await transport.serverState();
        status.value = answer.ok ? (await answer.json()).connection : "unknown";
    } catch {
        status.value = "unknown";
    }
}

usePoll(readConnection, () => true, 10000);
</script>

<template>
    <span data-connection-status>Connection: {{ label }}</span>
</template>
