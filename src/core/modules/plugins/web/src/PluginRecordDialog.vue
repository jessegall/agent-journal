<script setup>
import {Dialog} from "@journal/window-kit";

// what one plugin did: its last fault, what keeps running and the words of each output
defineProps({record: {type: Object, required: true}});
const emit = defineEmits(["close"]);

// a plugin that reports cards writes them as JSON; what a person reads is each card's words
function outputWords(text) {
    try {
        return JSON.parse(text).cards.map((card) => card.detail || card.title).join("\n");
    } catch {
        return text;
    }
}
</script>

<template>
    <Dialog :title="`What ${record.name} did`" @close="emit('close')">
        <div data-plugin-record-body>
            <template v-if="record.last_fault">
                <p class="plugin-fault">Last fault, {{ record.fault_count }} without a success: {{ record.last_fault }}</p>
            </template>
            <template v-if="record.services?.length">
                <p class="plugin-note" data-plugin-services>Keeps running: {{ record.services.map((service) => service.name).join(", ") }}</p>
            </template>
            <template v-if="!record.outputs.length">
                <p class="plugin-note">No activity yet.</p>
            </template>
            <template v-for="row in record.outputs" :key="row.id">
                <p class="plugin-output" data-plugin-output>{{ outputWords(row.output) }}</p>
            </template>
        </div>
    </Dialog>
</template>

<style scoped>
.plugin-output {
    margin: 0 0 6px;
    font-size: 13px;
    white-space: pre-wrap;
}

.plugin-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.plugin-fault {
    color: var(--danger);
    font-size: 12px;
}
</style>
