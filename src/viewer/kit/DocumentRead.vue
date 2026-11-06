<script setup>
import {ref} from "vue";
import {READ_RATES} from "../src/composables/readRates.js";
import Dashboard from "../src/kit/Dashboard.vue";
import {useEventRead} from "./useEventRead.js";
import {usePoll} from "./usePoll.js";
import {useWindow} from "./windowContextKey.js";

// a document a read line answers with: read again when one of the named events arrives, or at a slow rate when it names none
const props = defineProps({line: {type: [String, Array], required: true}, events: {type: Array, default: () => []}});
const emit = defineEmits(["file"]);
const context = useWindow();
const answer = ref(null);

async function load() {
    answer.value = await context.read(props.line);
}

if (props.events.length) useEventRead(load, props.events);
else usePoll(load, () => true, READ_RATES.documentWithNoEvents);
</script>

<template>
    <template v-if="answer && !answer.ok">
        <p class="window-failure">{{ answer.error }}</p>
    </template>
    <template v-else-if="answer">
        <Dashboard :document="answer.value" @file="emit('file', $event)" />
    </template>
</template>
