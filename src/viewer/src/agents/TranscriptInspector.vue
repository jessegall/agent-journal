<script setup>
import {computed, ref} from "vue";
import InspectorColumn from "./InspectorColumn.vue";
import InspectorSummary from "./InspectorSummary.vue";
import InspectorTop from "./InspectorTop.vue";
import TranscriptTurns from "./TranscriptTurns.vue";
import {narrow} from "../platform/view.js";

defineProps({
    name: {type: String, required: true},
    state: {type: Object, required: true},
    moves: {type: Array, default: () => []},
    facts: {type: Array, required: true},
    parts: {type: Array, required: true},
    env: {type: String, default: ""},
    transcript: {type: Object, required: true},
    speakers: {type: Object, required: true},
});
const emit = defineEmits(["close"]);
const turnsView = ref(null);
const scroller = computed(() => turnsView.value && turnsView.value.scroller);
defineExpose({scroller});
</script>

<template>
    <div :class="['transcript-inspector', {narrow}]">
        <InspectorTop @close="emit('close')"><slot name="top" /></InspectorTop>
        <InspectorSummary :name="name" :state="state" :moves="moves" :facts="facts" :parts="parts" :env="env">
            <template #stamp><slot name="stamp" /></template>
        </InspectorSummary>
        <div class="cols">
            <InspectorColumn title="Transcript">
                <TranscriptTurns ref="turnsView" :transcript="transcript" :speakers="speakers" :env="env" />
            </InspectorColumn>
        </div>
    </div>
</template>

<style scoped>
.transcript-inspector {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    background: var(--raised);
}

.cols {
    display: grid;
    flex: 1;
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    border-top: 1px solid var(--border);
}
</style>
