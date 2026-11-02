<script setup>
import Segmented from "../kit/Segmented.vue";
import {PRIORITY_LEVELS} from "../domain/taskPriority.js";

// where a task sits: its plan and phase, who holds it, and its priority
const PRIORITIES = PRIORITY_LEVELS.map(({key, label}) => ({key: String(key), label}));
defineProps({task: {type: Object, required: true}, place: {type: Object, default: null}, refusal: {type: String, default: ""}});
const emit = defineEmits(["priority"]);
</script>

<template>
    <div class="facts">
        <div class="fact wide">
            <span class="fact-label">Plan</span>
            <span class="fact-value">{{ place?.plan_id ? `Plan ${place.plan_id}: ${place.plan_title}` : "Not in a plan" }}</span>
        </div>
        <template v-if="place?.phase_total > 1">
            <div class="fact">
                <span class="fact-label">Phase</span>
                <span class="fact-value">{{ place.phase_number }} of {{ place.phase_total }}: {{ place.phase_title }}</span>
            </div>
        </template>
        <template v-if="task.state === 'started' && task.holder_id">
            <div class="fact">
                <span class="fact-label">Holder</span>
                <span class="fact-value">Agent {{ task.holder_id }}</span>
            </div>
        </template>
        <div class="fact wide">
            <span class="fact-label">Priority</span>
            <Segmented :options="PRIORITIES" :value="String(task.priority)" data-task-priority @pick="emit('priority', $event)" />
            <template v-if="refusal">
                <p class="refusal" role="alert" data-task-refusal>{{ refusal }}</p>
            </template>
        </div>
    </div>
</template>

<style scoped>
.refusal {
    margin: 2px 0 0;
    color: var(--danger);
    font-size: 12.5px;
}

.facts {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px 20px;
    margin-bottom: 18px;
}

.fact {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    min-width: 0;
}

.fact.wide {
    grid-column: 1 / -1;
}

.fact-label {
    color: var(--text-3);
    font-size: 12px;
}

.fact-value {
    font-size: 13px;
    overflow-wrap: anywhere;
}
</style>
