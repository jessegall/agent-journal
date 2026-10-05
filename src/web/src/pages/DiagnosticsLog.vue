<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import LogDialog from "../kit/LogDialog.vue";

const emit = defineEmits(["close"]);
const logged = ref("");

async function read() {
    logged.value = (await api.diagnostics().catch((e) => ({log: e.message}))).log;
}

async function clear() {
    logged.value = (await api.clearDiagnostics()).log;
}

onMounted(read);
</script>

<template>
    <LogDialog title="Developer error log" :logged="logged" @close="emit('close')" @clear="clear" />
</template>
