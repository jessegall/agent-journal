<script setup>
import TaskStatusIcon from "../tasks/TaskStatusIcon.vue";
import Icon from "../kit/Icon.vue";
import PlanPhaseAgents from "./PlanPhaseAgents.vue";

const CLOSED = new Set(["completed", "cancelled"]);
defineProps({phases: {type: Array, required: true}, currentPhase: {type: Number, required: true}});
const emit = defineEmits(["select"]);
const closedCount = (phase) => phase.tasks.filter((task) => CLOSED.has(task.state)).length;
const isDone = (phase) => phase.tasks.length > 0 && closedCount(phase) === phase.tasks.length;
</script>

<template>
    <ol class="phases">
        <template v-for="(phase, index) in phases" :key="phase.id">
            <li :class="['phase', {current: index + 1 === currentPhase, done: isDone(phase)}]" data-resource-phase>
                <div class="phead">
                    <span class="mark"><Icon :name="isDone(phase) ? 'check' : 'circle'" :size="14" /></span>
                    <span class="ptitle">{{ index + 1 }}. {{ phase.title }}</span>
                    <span class="phead-end">
                        <template v-if="phase.checkpoint">
                            <span class="checkpoint">checkpoint</span>
                        </template>
                        <span class="progress">{{ closedCount(phase) }}/{{ phase.tasks.length }}</span>
                    </span>
                </div>
                <template v-if="phase.goal">
                    <div class="when">{{ phase.goal }}</div>
                </template>
                <PlanPhaseAgents :tasks="phase.tasks" />
                <template v-for="task in phase.tasks" :key="task.id">
                    <button type="button" :class="['row', task.state]" data-resource-task @click="emit('select', task.id)">
                        <TaskStatusIcon :status="task.state" />
                        <span class="row-id">#{{ task.id }}</span>
                        <span class="row-title">{{ task.title }}</span>
                        <template v-if="task.helper_id">
                            <span
                                class="holder"
                                :title="task.state === 'open' ? `Queued for ${task.helper_name}` : `Held by ${task.helper_name}`"
                                data-plan-agent
                            >
                                {{ task.helper_name }}
                            </span>
                        </template>
                    </button>
                </template>
            </li>
        </template>
    </ol>
</template>

<style scoped>
.holder {
    min-width: 0;
    max-width: 35%;
    margin-left: auto;
    padding: 0 7px;
    border-radius: 99px;
    background: var(--hover);
    color: var(--text-3);
    font-size: 11px;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.phases {
    margin: 0;
    padding: 0;
    list-style: none;
}

.phase {
    padding: 12px 0;
    border-bottom: 1px solid var(--border-inner);
}

.phase.current {
    color: var(--text);
}

.phase.done .ptitle {
    color: var(--text-3);
}

.phead {
    display: flex;
    align-items: center;
    gap: 10px;
}

.mark {
    display: inline-flex;
    color: var(--accent-text);
}

.ptitle {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-weight: 500;
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
}

.phead-end {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
}

.checkpoint {
    color: var(--blocking);
    font-size: 11.5px;
}

.progress {
    color: var(--text-3);
    font-size: 12px;
}

.when {
    margin: 2px 0 6px 24px;
    color: var(--text-3);
    font-size: 12.5px;
}

.row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    width: 100%;
    padding: 4px 6px 4px 24px;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.row:hover {
    color: var(--text);
}

.row.completed .row-title,
.row.cancelled .row-title {
    color: var(--text-3);
}

.row.cancelled .row-title {
    text-decoration: line-through;
}

.row-id {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.row-title {
    min-width: 0;
    overflow-wrap: anywhere;
}
</style>
