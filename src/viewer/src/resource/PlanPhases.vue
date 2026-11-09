<script setup>
import Icon from "../kit/Icon.vue";
import PlanPhaseAgents from "./PlanPhaseAgents.vue";

const CLOSED = new Set(["completed", "cancelled"]);
defineProps({phases: {type: Array, required: true}, currentPhase: {type: Number, required: true}});
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
                    <slot name="task" :task="task" />
                </template>
            </li>
        </template>
    </ol>
</template>

<style scoped>
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
</style>
