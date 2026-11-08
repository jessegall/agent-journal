<script setup>
import {Dialog} from "@journal/window-kit";

// what one plugin did: what keeps running and the words of each output with its time
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

const outputTime = (createdAt) => new Date(createdAt).toLocaleString([], {dateStyle: "medium", timeStyle: "medium"});
</script>

<template>
    <Dialog padded :title="`What ${record.name} did`" @close="emit('close')">
        <div data-plugin-record-body>
            <template v-if="record.services?.length">
                <p class="plugin-note" data-plugin-services>Keeps running: {{ record.services.map((service) => service.name).join(", ") }}</p>
            </template>
            <template v-if="!record.outputs.length">
                <p class="plugin-note">No activity yet.</p>
            </template>
            <template v-for="row in record.outputs" :key="row.id">
                <p class="plugin-output-time" data-plugin-output-time>{{ outputTime(row.created_at) }}</p>
                <p class="plugin-output" data-plugin-output>{{ outputWords(row.output) }}</p>
            </template>
        </div>
    </Dialog>
</template>

<style scoped>
.plugin-output-time {
    margin: 10px 0 2px;
    color: var(--text-3);
    font-size: 11px;
}

.plugin-output {
    margin: 0;
    font-size: 13px;
    white-space: pre-wrap;
}

.plugin-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
