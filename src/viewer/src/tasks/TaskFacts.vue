<script setup>
import Segmented from "../kit/Segmented.vue";
import {peekRef} from "../route.js";
import {PRIORITY_LEVELS, namedPriority} from "../domain/taskPriority.js";

// where a task sits: its plan and phase, the agent it is queued for or held by, and its priority
const PRIORITIES = PRIORITY_LEVELS.map(({key, label}) => ({key: String(key), label}));
defineProps({task: {type: Object, required: true}, place: {type: Object, default: null}, refusal: {type: String, default: ""}});
const emit = defineEmits(["priority"]);
const HELD_STATES = new Set(["started", "testing", "blocked"]);
</script>

<template>
    <div class="facts">
        <div class="fact wide">
            <span class="fact-label">Plan</span>
            <template v-if="place?.plan_id">
                <button type="button" class="fact-value agent-link" :title="`Open plan ${place.plan_id}`" data-task-plan-link @click="peekRef(`plans:${place.plan_id}`)">Plan {{ place.plan_id }}: {{ place.plan_title }}</button>
            </template>
            <template v-else>
                <span class="fact-value">Not in a plan</span>
            </template>
        </div>
        <template v-if="place?.phase_total > 1">
            <div class="fact">
                <span class="fact-label">Phase</span>
                <span class="fact-value">{{ place.phase_number }} of {{ place.phase_total }}: {{ place.phase_title }}</span>
            </div>
        </template>
        <template v-if="task.helper_id">
            <div class="fact">
                <span class="fact-label">{{ task.state === "open" ? "Queued for" : "Delegated to" }}</span>
                <button type="button" class="fact-value agent-link" :title="`Open ${task.helper_name}`" data-task-agent @click="peekRef(`agents:${task.helper_id}`)">{{ task.helper_name }}</button>
            </div>
            <template v-if="HELD_STATES.has(task.state)">
                <p class="held-note" data-task-held-by>{{ task.helper_name }} holds it: merging its work finishes it, and releasing the worker opens it again.</p>
            </template>
            <template v-else-if="task.state === 'open'">
                <p class="held-note" data-task-held-by>{{ task.helper_name }} takes it after the task it is on. Releasing the worker opens it again.</p>
            </template>
        </template>
        <template v-else-if="task.state === 'started' && task.holder_id">
            <div class="fact">
                <span class="fact-label">Assigned to</span>
                <span class="fact-value">Agent {{ task.holder_id }}</span>
            </div>
        </template>
        <div class="fact wide">
            <span class="fact-label">Priority</span>
            <Segmented :options="PRIORITIES" :value="String(namedPriority(task.priority))" data-task-priority @pick="emit('priority', $event)" />
            <template v-if="refusal">
                <p class="refusal" role="alert" data-task-refusal>{{ refusal }}</p>
            </template>
        </div>
    </div>
</template>

<style scoped>
.held-note {
    grid-column: 1 / -1;
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.agent-link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

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
