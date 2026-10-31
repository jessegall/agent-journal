<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import FlowchartDialog from "./FlowchartDialog.vue";
import {clock} from "../format/time.js";

defineProps({title: {type: String, required: true}, edges: {type: Array, required: true}, time: {type: Number, required: true}});
const opened = ref(false);
</script>

<template>
    <div class="flowchart-card">
        <MarkIcon name="flowchart" />
        <div class="flowchart-card-words">
            <span class="flowchart-card-kind">Flowchart · {{ clock(time) }}</span>
            <span class="flowchart-card-title">{{ title }}</span>
        </div>
        <Btn class="flowchart-open" kind="primary" @click="opened = true">Open the flowchart</Btn>
    </div>
    <template v-if="opened">
        <FlowchartDialog :title="title" :edges="edges" @close="opened = false" />
    </template>
</template>

<style scoped>
.flowchart-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.flowchart-card-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.flowchart-card-kind {
    color: var(--text-3);
    font-size: 11.5px;
}

.flowchart-card-title {
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
}
</style>
